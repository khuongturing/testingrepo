from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ReadOnlyModelViewSet

from apps.orders.models import Tax
from ..serializers import TaxSerializer


class TaxViewSet(ReadOnlyModelViewSet):
    permission_classes = (AllowAny,)
    queryset = Tax.objects.all()
    serializer_class = TaxSerializer
