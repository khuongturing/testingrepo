from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from apps.api.tests.utils import set_authorization_header


class OrderTestCase(TestCase):

    fixtures = ('users', 'customers', 'tokens', 'shipping_regions', 'shippings', 'products', 'shopping_cart', 'tax',
                'orders')
    token = '641ad88de5bf0f070c55813a95659e47c050b5f5'

    def setUp(self):
        self.client = APIClient()

    def test_create_order(self):

        set_authorization_header(self.client, self.token)

        order = {
            'cart_id': 'EaDEgmYjhg1Y0HKRydrwti3dfYP3Vd',
            'shipping_id': 1,
            'tax_id': 1
        }

        response = self.client.post(reverse('api:orders'), order, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertIsInstance(response.data['order_id'], int)

    def test_get_order_by_id(self):

        set_authorization_header(self.client, self.token)
        response = self.client.get(reverse('api:orders', kwargs={'pk': 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        order = response.data
        self.assertIsInstance(order, dict)
        self.assertIsInstance(order['order_id'], int)

        items = order['order_items']
        self.assertIsInstance(items, list)
        self.assertGreater(len(order['order_items']), 0)

        item = items[0]
        self.assertIsInstance(item['product_id'], int)
        self.assertIsNotNone(item['subtotal'])
        self.assertIsNotNone(item['product_name'])

    def test_customer_orders(self):

        set_authorization_header(self.client, self.token)
        response = self.client.get(reverse('api:customer-orders'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        orders = response.data
        self.assertIsInstance(orders, list)
        self.assertGreater(len(orders), 0)

        order = orders[0]
        self.assertIsInstance(order, dict)
        self.assertIsInstance(order['order_id'], int)
        self.assertIsNotNone(order['total_amount'])
        self.assertIsNotNone(order['name'])

    def test_order_short_detail(self):

        set_authorization_header(self.client, self.token)
        response = self.client.get(reverse('api:short-order', kwargs={'pk': 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        order = response.data
        self.assertIsInstance(order, dict)
        self.assertIsInstance(order['order_id'], int)
        self.assertIsNotNone(order['name'])
        self.assertIsNotNone(order['status'])
        self.assertIsNotNone(order['total_amount'])

    def test_requests_without_token(self):

        # create order without token
        response = self.client.post(reverse('api:orders'), {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # get order without token
        response = self.client.get(reverse('api:orders', kwargs={'pk': 1}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # get customer's orders without token
        response = self.client.get(reverse('api:customer-orders'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # get order's short details without token
        response = self.client.get(reverse('api:short-order', kwargs={'pk': 1}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)