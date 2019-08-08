from rest_framework.permissions import BasePermission, IsAuthenticated

from apps.users.models import Customer


class CanCreateOrIsAuthenticated(IsAuthenticated):

    SAFE_METHODS = ('POST',)

    def has_permission(self, request, view):
        if request.method in self.SAFE_METHODS:
            return True
        return super(CanCreateOrIsAuthenticated, self).has_permission(request, view)


class CanRetrieveOrIsAuthenticated(IsAuthenticated):

    SAFE_METHODS = ('GET',)

    def has_permission(self, request, view):
        if request.method in self.SAFE_METHODS:
            return True
        return super(CanRetrieveOrIsAuthenticated, self).has_permission(request, view)


class IsCustomer(BasePermission):

    def has_permission(self, request, view):
        return isinstance(request.user, Customer)


class CanCreateOrIsCustomer(IsCustomer):

    SAFE_METHODS = ('POST',)

    def has_permission(self, request, view):
        if request.method in self.SAFE_METHODS:
            return True
        return super(CanCreateOrIsCustomer, self).has_permission(request, view)