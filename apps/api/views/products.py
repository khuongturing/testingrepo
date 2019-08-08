from rest_framework import mixins
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from apps.products.models import Product, Review
from ..permissions import CanRetrieveOrIsAuthenticated
from ..serializers import ProductListSerializer, ProductSerializer, ReviewSerializer


class ProductPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'limit'

    def get_paginated_response(self, data):
        return Response({
            'paginationMeta': {
                'currentPage': self.page.number,
                'totalPages': self.page.paginator.num_pages,
                'currentPageSize': len(self.page.object_list),
                'totalRecords': self.page.paginator.count
            },
            'rows': data
        })


class ProductListViewSet(mixins.ListModelMixin, GenericViewSet):
    permission_classes = (AllowAny,)
    serializer_class = ProductListSerializer
    pagination_class = ProductPagination

    def get_queryset(self):
        qs = self._get_queryset()
        return qs.order_by('product_id')

    def _get_queryset(self):
        category_id = self.kwargs.get('category_id')
        if category_id is not None:
            return Product.objects.filter(productcategory__category_id=category_id)

        department_id = self.kwargs.get('department_id')
        if department_id is not None:
            return Product.objects.filter(productcategory__category__department_id=department_id)

        query_string = self.request.query_params.get('query_string')
        if query_string:
            all_words = self.request.query_params.get('all_words') == 'on'
            product_ids = Product.objects.search(query_string, boolean_mode=all_words)
            return Product.objects.filter(pk__in=product_ids)

        return Product.objects.all()


class ProductViewSet(mixins.RetrieveModelMixin, GenericViewSet):
    permission_classes = (AllowAny,)
    serializer_class = ProductSerializer
    queryset = Product.objects.all()


class ReviewViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, GenericViewSet):
    permission_classes = (CanRetrieveOrIsAuthenticated,)
    serializer_class = ReviewSerializer

    def get_queryset(self):
        if self.request.method == 'GET':
            return Review.objects.filter(product_id=self.kwargs.get('product_id'))
        return Review.objects.all()

    def perform_create(self, serializer):
        serializer._validated_data['customer'] = self.request.user
        super(ReviewViewSet, self).perform_create(serializer)
