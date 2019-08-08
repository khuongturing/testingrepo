from rest_framework import mixins
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import GenericViewSet

from apps.orders.models import ShippingRegion, Shipping
from ..serializers import ShippingRegionSerializer, ShippingSerializer


class ShippingRegionViewSet(mixins.ListModelMixin, GenericViewSet):
    permission_classes = (AllowAny,)
    queryset = ShippingRegion.objects.all()
    serializer_class = ShippingRegionSerializer


class RegionShippingViewSet(mixins.ListModelMixin, GenericViewSet):
    permission_classes = (AllowAny,)
    serializer_class = ShippingSerializer

    def get_queryset(self):
        region_id = self.kwargs.get('pk')
        return Shipping.objects.filter(shipping_region_id=region_id)
