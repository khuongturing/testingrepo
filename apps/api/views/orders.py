from rest_framework import mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet

from apps.orders.models import Order
from ..permissions import IsCustomer
from ..serializers import CreateOrderSerializer, OrderSerializer, CustomerOrderSerializer, ShortOrderSerializer


class OrderViewSet(mixins.CreateModelMixin, mixins.RetrieveModelMixin, GenericViewSet):
    permission_classes = (IsAuthenticated, IsCustomer)
    queryset = Order.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateOrderSerializer
        return OrderSerializer

    def perform_create(self, serializer):
        serializer._validated_data['customer'] = self.request.user
        super(OrderViewSet, self).perform_create(serializer)

        order = serializer.instance
        cart_id = serializer._cart_id
        Order.objects.add_items(cart_id, order)


class CustomerOrderViewSet(mixins.ListModelMixin, GenericViewSet):
    permission_classes = (IsAuthenticated, IsCustomer)
    serializer_class = CustomerOrderSerializer

    def get_queryset(self):
        return Order.objects.select_related('customer').filter(customer=self.request.user)


class ShortOrderViewSet(mixins.RetrieveModelMixin, GenericViewSet):
    permission_classes = (IsAuthenticated, IsCustomer)
    queryset = Order.objects.select_related('customer')
    serializer_class = ShortOrderSerializer
