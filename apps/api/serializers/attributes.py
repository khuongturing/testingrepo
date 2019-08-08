from rest_framework import serializers

from apps.products.models import Attribute, AttributeValue


class AttributeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Attribute
        fields = '__all__'


class AttributeValueSerializer(serializers.ModelSerializer):

    class Meta:
        model = AttributeValue
        fields = ('attribute_value_id', 'value')


class ProductAttributesSerializer(serializers.ModelSerializer):

    attribute_name = serializers.CharField(source='attribute.name')
    attribute_value = serializers.CharField(source='value')

    class Meta:
        model = AttributeValue
        fields = ('attribute_name', 'attribute_value_id', 'attribute_value')