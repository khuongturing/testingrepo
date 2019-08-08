from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from apps.api.tests.utils import set_authorization_header


class StripeTestCase(TestCase):

    fixtures = ('users', 'customers', 'tokens', 'shipping_regions', 'shippings', 'products', 'shopping_cart', 'tax',
                'orders')
    token = '641ad88de5bf0f070c55813a95659e47c050b5f5'
    wrong_token = '85a69f892ef3c486f6061ea5f69e7fc36dd666a2'

    @classmethod
    def setUpClass(cls):
        super(StripeTestCase, cls).setUpClass()
        cls.url = reverse('api:payment-stripe')

    def setUp(self):
        self.client = APIClient()
        self.params = {
            "stripeToken": "12345sdfsfa",
            "email": "joey@gmail.com",
            "order_id": 1
        }

    def test_payment_without_customer(self):
        response = self.client.post(self.url, self.params, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_payment_with_wrong_customer(self):

        set_authorization_header(self.client, self.wrong_token)
        response = self.client.post(self.url, self.params, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_payment_with_wrong_email(self):

        self.params['email'] = 'abc@gmail.com'
        set_authorization_header(self.client, self.token)
        response = self.client.post(self.url, self.params, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_payment_without_email(self):
        self.params.pop('email')
        set_authorization_header(self.client, self.token)
        response = self.client.post(self.url, self.params, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_payment_without_token(self):
        self.params.pop('stripeToken')
        set_authorization_header(self.client, self.token)
        response = self.client.post(self.url, self.params, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_payment_with_wrong_order(self):
        self.params['order_id'] = 4
        set_authorization_header(self.client, self.token)
        response = self.client.post(self.url, self.params, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_payment(self):
        set_authorization_header(self.client, self.token)
        response = self.client.post(self.url, self.params, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)