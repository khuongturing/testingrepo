from rest_framework import serializers

from apps.orders.models import ShippingRegion, Shipping


class ShippingRegionSerializer(serializers.ModelSerializer):

    class Meta:
        model = ShippingRegion
        fields = '__all__'


class ShippingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Shipping
        fields = ('shipping_id', 'shipping_type', 'shipping_cost', 'shipping_region_id')
