from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ReadOnlyModelViewSet

from apps.products.models import Department
from ..serializers import DepartmentSerializer


class DepartmentViewSet(ReadOnlyModelViewSet):
    permission_classes = (AllowAny,)
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
