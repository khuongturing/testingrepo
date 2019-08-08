from rest_framework import mixins
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ReadOnlyModelViewSet, GenericViewSet

from apps.products.models import Attribute, AttributeValue
from ..serializers import AttributeSerializer, AttributeValueSerializer, ProductAttributesSerializer


class AttributeViewSet(ReadOnlyModelViewSet):
    permission_classes = (AllowAny,)
    queryset = Attribute.objects.all()
    serializer_class = AttributeSerializer


class AttributeValueViewSet(mixins.ListModelMixin, GenericViewSet):
    permission_classes = (AllowAny,)
    serializer_class = AttributeValueSerializer

    def get_queryset(self):
        attribute_id = self.kwargs.get('pk')
        return AttributeValue.objects.filter(attribute_id=attribute_id)


class ProductAttributesViewSet(mixins.ListModelMixin, GenericViewSet):
    permission_classes = (AllowAny,)
    serializer_class = ProductAttributesSerializer

    def get_queryset(self):
        product_id = self.kwargs.get('pk')
        return AttributeValue.objects.filter(productattribute__product_id=product_id).select_related('attribute')