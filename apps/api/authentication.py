from datetime import timedelta

from django.conf import settings
from django.utils import timezone
from rest_framework.authentication import TokenAuthentication as DRFTokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed

from tshirtshop.utils import user_or_customer


# this returns left time
def expires_in(token):
    time_elapsed = timezone.now() - token.created
    left_time = timedelta(seconds = settings.TOKEN_EXPIRED_AFTER_SECONDS) - time_elapsed
    return left_time


# token checker if token expired or not
def is_token_expired(token):
    return expires_in(token) < timedelta(seconds = 0)


# if token is expired, it will be deleted and a new token will be established
def token_expire_handler(token):
    is_expired = is_token_expired(token)
    if is_expired:
        token.delete()
        token = Token.objects.create(user = token.user)
    return is_expired, token


class TokenAuthentication(DRFTokenAuthentication):
    keyword = 'Bearer'

    def authenticate_credentials(self, key):
        user, token = super(TokenAuthentication, self).authenticate_credentials(key)

        is_expired, token = token_expire_handler(token)
        if is_expired:
            raise AuthenticationFailed("The Token is expired")

        _, user = user_or_customer(user)
        return user, token
