from rest_framework import serializers

from apps.orders.models import Order, OrderDetail


class CreateOrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = ('shipping', 'tax', 'order_id')
        read_only_fields = ('order_id',)
        extra_kwargs = {
            'shipping': {'write_only': True},
            'tax': {'write_only': True},
        }

    def is_valid(self, raise_exception=False):

        cart_id = self.initial_data.pop('cart_id', None)
        if cart_id is None:
            raise serializers.ValidationError({'cart_id': 'This field is required.'})

        self._cart_id = cart_id
        self.initial_data['shipping'] = self.initial_data.pop('shipping_id', None)
        self.initial_data['tax'] = self.initial_data.pop('tax_id', None)
        return super(CreateOrderSerializer, self).is_valid(raise_exception=raise_exception)


class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderDetail
        fields = ('product_id', 'attributes', 'product_name', 'quantity', 'unit_cost', 'subtotal')


class OrderSerializer(serializers.ModelSerializer):

    order_items = serializers.SerializerMethodField(method_name='get_items')

    class Meta:
        model = Order
        fields = ('order_id', 'order_items')

    def get_items(self, order):
        qs = OrderDetail.objects.select_related('product').filter(order=order)
        return OrderItemSerializer(qs, many=True).data


class CustomerOrderSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source='customer.name')

    class Meta:
        model = Order
        fields = ('order_id', 'total_amount', 'created_on', 'shipped_on', 'name')


class ShortOrderSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source='customer.name')
    status = serializers.CharField(source='get_status_display')

    class Meta:
        model = Order
        fields = ('order_id', 'total_amount', 'created_on', 'shipped_on', 'status', 'name')
