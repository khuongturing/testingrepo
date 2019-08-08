from rest_framework import mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet

from ..permissions import CanCreateOrIsCustomer, CanCreateOrIsAuthenticated, IsCustomer
from ..serializers import (CustomerCreateSerializer, CustomerSerializer, CustomerUpdateSerializer,
                           CustomerAddressSerializer, CustomerCreditCardSerializer)


class CustomerViewSet(mixins.CreateModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, GenericViewSet):
    permission_classes = (CanCreateOrIsAuthenticated, CanCreateOrIsCustomer)

    def get_serializer_class(self):
        method = self.request.method
        if method == 'POST':
            return CustomerCreateSerializer
        if method == 'PUT':
            return CustomerUpdateSerializer
        return CustomerSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        # implementing partial update on PUT request
        kwargs['partial'] = True
        return super(CustomerViewSet, self).update(request, *args, **kwargs)


class CustomerAddressView(mixins.UpdateModelMixin, GenericViewSet):
    permission_classes = (IsAuthenticated, IsCustomer)
    serializer_class = CustomerAddressSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        # implementing partial update on PUT request
        kwargs['partial'] = True
        return super(CustomerAddressView, self).update(request, *args, **kwargs)


class CustomerCreditCardView(mixins.UpdateModelMixin, GenericViewSet):
    permission_classes = (IsAuthenticated, IsCustomer)
    serializer_class = CustomerCreditCardSerializer

    def get_object(self):
        return self.request.user
