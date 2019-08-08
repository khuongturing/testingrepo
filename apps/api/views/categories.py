from rest_framework import mixins
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet, GenericViewSet

from ..serializers import CategorySerializer
from apps.products.models import Category


class CategoryViewSet(ReadOnlyModelViewSet):
    permission_classes = (AllowAny,)
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def list(self, request, *args, **kwargs):
        response = super(CategoryViewSet, self).list(request, *args, **kwargs)
        data = {'rows': response.data}
        return Response(data)


class ProductCategoryViewSet(mixins.RetrieveModelMixin, GenericViewSet):
    permission_classes = (AllowAny,)
    serializer_class = CategorySerializer

    def get_object(self):
        product_id = self.kwargs.get('pk')
        return Category.objects.filter(productcategory__product_id=product_id).first()


class DepartmentCategoriesViewSet(mixins.ListModelMixin, GenericViewSet):
    permission_classes = (AllowAny,)
    serializer_class = CategorySerializer

    def get_queryset(self):
        department_id = self.kwargs.get('pk')
        return Category.objects.filter(department_id=department_id)

    def list(self, request, *args, **kwargs):
        response = super(DepartmentCategoriesViewSet, self).list(request, *args, **kwargs)
        data = {'rows': response.data}
        return Response(data)
