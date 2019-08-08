from rest_framework import serializers

from apps.orders.models import ShoppingCart


class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = ShoppingCart
        fields = ('item_id', 'cart_id', 'product_id', 'attributes', 'quantity')


class AddItemSerializer(ItemSerializer):

    class Meta(ItemSerializer.Meta):
        fields = ItemSerializer.Meta.fields + ('product',)
        read_only_fields = ('item_id', 'product_id')
        extra_kwargs = {
            'product': {'write_only': True}
        }

    def is_valid(self, raise_exception=False):
        # API is sending product_id but serializer expects product
        # so here I am replacing product_id with product
        product_id = self.initial_data.pop('product_id', None)
        if product_id is not None:
            self.initial_data['product'] = product_id
        return super(AddItemSerializer, self).is_valid(raise_exception=raise_exception)


class UpdateItemSerializer(ItemSerializer):

    class Meta(ItemSerializer.Meta):
        read_only_fields = ('item_id', 'cart_id', 'product_id', 'attributes')


class ItemProductSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source='product.name')
    image = serializers.CharField(source='product.image')
    price = serializers.CharField(source='product.price')
    discounted_price = serializers.CharField(source='product.discounted_price')

    class Meta:
        model = ShoppingCart
        fields = ('item_id', 'cart_id', 'name', 'attributes', 'product_id', 'image', 'price', 'discounted_price',
                  'quantity', 'subtotal')
