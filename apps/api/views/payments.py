from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.orders.models import Order
from integrations.payment import charge
from ..permissions import IsCustomer
from ..serializers import StripeSerializer


class StripePaymentView(CreateAPIView):
    permission_classes = (IsAuthenticated, IsCustomer)
    serializer_class = StripeSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.data
        stripe_token = data['stripeToken']
        email = data['email']
        order_id = data['order_id']

        # it is safe to use .get here because validation has been done in serializer
        order = Order.objects.select_related('customer').get(pk=order_id)
        res = {}
        status_ = status.HTTP_200_OK
        if order.customer == request.user and email == request.user.email:
            if order.status != Order.CONFIRMED:
                charge_ = charge(stripe_token, order.total_amount, order, email)
                if charge_['status']:
                    order.status = Order.CONFIRMED
                    res['data'] = charge_['data']
                else:
                    order.status = Order.CANCELLED
                order.save()
                res['message'] = charge_['msg']
            else:
                status_ = status.HTTP_400_BAD_REQUEST
                res['message'] = 'Payment has already been done'
        else:
            status_ = status.HTTP_400_BAD_REQUEST
            res['message'] = 'Order and Customer does not match'

        headers = self.get_success_headers(serializer.data)
        return Response(res, status=status_, headers=headers)