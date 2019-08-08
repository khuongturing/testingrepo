from django.contrib.auth.backends import ModelBackend

from tshirtshop.utils import user_or_customer


class CustomModelBackend(ModelBackend):

    def authenticate(self, request, username=None, password=None, **kwargs):
        user = super(CustomModelBackend, self).authenticate(request, username, password, **kwargs)
        if user is not None:
            _, user = user_or_customer(user)
        return user

    def get_user(self, user_id):
        user = super(CustomModelBackend, self).get_user(user_id)
        if user is not None:
            _, user = user_or_customer(user)
        return user
