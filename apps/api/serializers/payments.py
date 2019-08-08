from rest_framework import serializers

from apps.orders.models import Order


class StripeSerializer(serializers.Serializer):
    stripeToken = serializers.CharField()
    email = serializers.EmailField()
    order_id = serializers.IntegerField()

    def validate_order_id(self, order_id):
        if not Order.objects.filter(pk=order_id).exists():
            raise serializers.ValidationError('This Order does not exist.')
        return order_id
