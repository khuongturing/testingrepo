from rest_auth.models import TokenModel
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from apps.api.authentication import expires_in
from apps.users.models import Customer
from tshirtshop.utils import user_or_customer


class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = ('customer_id', 'name', 'email', 'address_1', 'address_2', 'city', 'region', 'postal_code',
                  'shipping_region_id', 'credit_card', 'day_phone', 'eve_phone', 'mob_phone')


class TokenSerializer(serializers.ModelSerializer):

    customer = serializers.SerializerMethodField(read_only=True)
    accessToken = serializers.CharField(source='key', read_only=True)
    expiresIn = serializers.SerializerMethodField(method_name='get_expires_in', read_only=True)

    class Meta:
        model = TokenModel
        fields = ('accessToken', 'expiresIn', 'customer')

    def get_expires_in(self, token):
        return expires_in(token)

    def get_customer(self, token):
        _, customer = user_or_customer(token.user)
        return CustomerSerializer(instance=customer).data


class CustomerTokenSerializer(serializers.ModelSerializer):

    customer = CustomerSerializer(read_only=True)
    accessToken = serializers.SerializerMethodField(method_name='get_token', read_only=True)
    expiresIn = serializers.SerializerMethodField(method_name='get_expires_in', read_only=True)

    class Meta:
        model = Customer
        fields = ('accessToken', 'expiresIn', 'customer')

    def get_token(self, customer):
        return self._get_token(customer).key

    def get_expires_in(self, customer):
        return expires_in(self._get_token(customer))

    def _get_token(self, customer):
        if getattr(self, '_customer_token', None) is None:
            self._customer_token, _ = Token.objects.get_or_create(user=customer.user)
        return self._customer_token


class CustomerCreateSerializer(CustomerTokenSerializer):

    class Meta(CustomerTokenSerializer.Meta):
        fields = ('name', 'email', 'password') + CustomerTokenSerializer.Meta.fields
        extra_kwargs = {
            'name': {'write_only': True},
            'email': {'write_only': True},
            'password': {'write_only': True},
        }


class CustomerUpdateSerializer(CustomerSerializer):

    class Meta(CustomerSerializer.Meta):
        read_only_fields = (
            'customer_id', 'address_1', 'address_2', 'city', 'region', 'postal_code', 'shipping_region_id',
            'credit_card'
        )


class CustomerAddressSerializer(CustomerSerializer):

    class Meta(CustomerSerializer.Meta):
        fields = CustomerSerializer.Meta.fields + ('shipping_region',)
        read_only_fields = (
            'customer_id', 'name', 'email', 'credit_card', 'day_phone', 'eve_phone', 'mob_phone', 'shipping_region_id'
        )
        extra_kwargs = {
            'shipping_region': {'write_only': True}
        }

    def is_valid(self, raise_exception=False):
        # API is sending shipping_region_id but serializer expects shipping_region
        # so here I am replacing shipping_region_id with shipping_region
        shipping_region_id = self.initial_data.pop('shipping_region_id', None)
        if shipping_region_id is not None:
            self.initial_data['shipping_region'] = shipping_region_id
        return super(CustomerAddressSerializer, self).is_valid(raise_exception=raise_exception)


class CustomerCreditCardSerializer(CustomerSerializer):

    class Meta(CustomerSerializer.Meta):
        read_only_fields = (
            'customer_id', 'name', 'email', 'address_1', 'address_2', 'city', 'region', 'postal_code',
            'shipping_region_id', 'day_phone', 'eve_phone', 'mob_phone'
        )