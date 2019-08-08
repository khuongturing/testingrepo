from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_auth.models import TokenModel
from rest_framework import status
from rest_framework.test import APIClient

from tshirtshop.utils import user_or_customer
from .utils import set_authorization_header

User = get_user_model()


class CustomerTestCase(TestCase):

    fixtures = ('shipping_regions', 'users', 'tokens', 'customers')

    def setUp(self):
        self.client = APIClient()

    def _assert_customer_token(self, data, user):
        customer = data['customer']
        self.assertIsNotNone(customer)
        self.assertIsNotNone(data['accessToken'])
        self.assertIsNotNone(data['expiresIn'])

        self.assertIsInstance(customer['customer_id'], int)
        self.assertEqual(customer['email'], user['email'])
        self.assertIsNone(customer.get('password'))

    def test_registration(self):
        user = {
            'name': 'Chandler Bing',
            'email': 'MissChandlerBong@gmail.com',
            'password': 'aSarcasticPassword!',
        }

        response = self.client.post(reverse('api:customers'), user, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        data = response.data
        self._assert_customer_token(data, user)
        self.assertEqual(data['customer']['name'], user['name'])

    def test_login(self):

        user = {
            'email': 'joey@gmail.com',
            'password': 'rootroot'
        }

        response = self.client.post(reverse('api:customers-login'), user, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data
        self._assert_customer_token(data, user)

    def test_logout(self):

        set_authorization_header(self.client, '641ad88de5bf0f070c55813a95659e47c050b5f5')
        response = self.client.post(reverse('api:customers-logout'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_details_request(self):

        set_authorization_header(self.client, '5865a669a8361d3235a7d9475ffd77eb17708c9e')
        response = self.client.get(reverse('api:customers'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        customer = response.data
        self.assertIsInstance(customer['customer_id'], int)
        self.assertIsNotNone(customer['email'])
        self.assertIsNone(customer.get('password'))

    def test_update_request(self):

        set_authorization_header(self.client, '85a69f892ef3c486f6061ea5f69e7fc36dd666a2')

        updates = {
            'eve_phone': '4746363',
            'name': 'Murial'
        }

        response = self.client.put(reverse('api:customers'), updates, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        customer = response.data
        self.assertIsInstance(customer['customer_id'], int)
        self.assertEqual(customer['name'], updates['name'])
        self.assertEqual(customer['eve_phone'], updates['eve_phone'])

    def test_invalid_update_request(self):

        token = '641ad88de5bf0f070c55813a95659e47c050b5f5'

        _, customer = user_or_customer(TokenModel.objects.get(key=token).user)
        updates = {
            'credit_card': '123123'
        }

        # to check if the previous and new credit card is not same
        self.assertNotEqual(customer.credit_card, updates['credit_card'])

        set_authorization_header(self.client, token)
        response = self.client.put(reverse('api:customers'), updates, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        updated_customer = response.data
        self.assertEqual(customer.credit_card, updated_customer['credit_card'])
        self.assertNotEqual(updates['credit_card'], updated_customer['credit_card'])

    def test_credit_card_update(self):

        token = '641ad88de5bf0f070c55813a95659e47c050b5f5'

        _, customer = user_or_customer(TokenModel.objects.get(key=token).user)
        updates = {
            'credit_card': '123123'
        }

        # to check if the previous and new credit card is not same
        self.assertNotEqual(customer.credit_card, updates['credit_card'])

        set_authorization_header(self.client, token)
        response = self.client.put(reverse('api:customers-credit-card'), updates, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        updated_customer = response.data
        self.assertNotEqual(customer.credit_card, updated_customer['credit_card'])
        self.assertEqual(updates['credit_card'], updated_customer['credit_card'])

    def test_address_update(self):

        token = '641ad88de5bf0f070c55813a95659e47c050b5f5'

        updates = {
            'address_1': 'test_add_1',
            'address_2': 'test_add_2',
            'city': 'test_city',
            'region': 'region',
            'postal_code': '54000',
            'shipping_region_id': 2,
        }

        set_authorization_header(self.client, token)
        response = self.client.put(reverse('api:customers-address'), updates, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        customer = response.data
        for key, value in updates.items():
            self.assertEqual(value, customer[key])

    def test_requests_without_token(self):

        # customer details without token
        response = self.client.get(reverse('api:customers'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # customer update without token
        response = self.client.put(reverse('api:customers'), {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # address update without token
        response = self.client.put(reverse('api:customers-address'), {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # credit card update without token
        response = self.client.put(reverse('api:customers-credit-card'), {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
