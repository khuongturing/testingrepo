from rest_framework import serializers

from apps.products.models import Product, Review

DESCRIPTION_LENGTH = 200


class DescriptionMixin(serializers.ModelSerializer):
    description = serializers.SerializerMethodField()

    def get_description(self, product):
        len_ = self.context['request'].query_params.get('description_length', DESCRIPTION_LENGTH)
        return product.description[:int(len_)]


class ProductListSerializer(DescriptionMixin, serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = ('product_id', 'name', 'description', 'price', 'discounted_price', 'thumbnail')


class ProductSerializer(DescriptionMixin, serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = ('product_id', 'name', 'description', 'price', 'discounted_price', 'image', 'image_2', 'thumbnail',
                  'display')


class ReviewSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source='customer.name', read_only=True)

    class Meta:
        model = Review
        fields = ('name', 'review', 'rating', 'created_on', 'product')
        read_only_fields = ('created_on',)
        extra_kwargs = {
            'product': {'write_only': True},
        }

    def is_valid(self, raise_exception=False):

        product_id = self.initial_data.pop('product_id', None)
        if product_id is None:
            raise serializers.ValidationError({'product_id': 'This field is required.'})

        self.initial_data['product'] = product_id
        return super(ReviewSerializer, self).is_valid(raise_exception=raise_exception)