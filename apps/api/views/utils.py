from rest_framework import status
from rest_framework.mixins import DestroyModelMixin


class DestroyModelMixinOK(DestroyModelMixin):

    def destroy(self, request, *args, **kwargs):
        response = super(DestroyModelMixinOK, self).destroy(request, *args, **kwargs)
        if response.status_code == status.HTTP_204_NO_CONTENT:
            response.status_code = status.HTTP_200_OK
        return response
