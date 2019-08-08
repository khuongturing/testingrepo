from rest_framework import mixins
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet, GenericViewSet

from apps.orders.models import ShoppingCart
from apps.orders.utils import generate_cart_id
from .utils import DestroyModelMixinOK
from ..serializers import AddItemSerializer, UpdateItemSerializer, ItemProductSerializer


class CartIDView(ViewSet):
    permission_classes = (AllowAny,)

    def retrieve(self, request, *args, **kwargs):
        return Response({'cart_id': generate_cart_id()})


class CartItemViewSet(mixins.CreateModelMixin, mixins.UpdateModelMixin, DestroyModelMixinOK, GenericViewSet):
    permission_classes = (AllowAny,)
    queryset = ShoppingCart.objects.all()

    def get_serializer_class(self):

        if self.request.method == 'POST':
            return AddItemSerializer
        if self.request.method == 'PUT':
            return UpdateItemSerializer


class CartViewSet(mixins.ListModelMixin, DestroyModelMixinOK, GenericViewSet):
    permission_classes = (AllowAny,)
    queryset = ShoppingCart.objects.select_related('product').all()
    serializer_class = ItemProductSerializer
    lookup_field = 'cart_id'

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        filter_kwargs = {self.lookup_field: self.kwargs[lookup_url_kwarg]}
        return queryset.filter(**filter_kwargs)

