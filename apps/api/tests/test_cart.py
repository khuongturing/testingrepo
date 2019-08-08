from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


class ShoppingCartTestCase(TestCase):

    fixtures = ('products', 'shopping_cart')

    # from shopping_cart.json
    cart_id = 'EaDEgmYjhg1Y0HKRydrwti3dfYP3Vd'

    def setUp(self):
        self.client = APIClient()

    def test_generate_cart_id(self):
        response = self.client.get(reverse('api:cart-unique-id'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        id_ = response.data['cart_id']
        self.assertIsNotNone(id_)
        self.assertIsInstance(id_, str)

    def test_add_product_to_cart(self):

        product = {
            'cart_id': self.cart_id,
            'product_id': 2,
            'attributes': 'test attributes',
            'quantity': 2
        }

        response = self.client.post(reverse('api:cart-items'), product, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        cart = response.data
        self.assertIsInstance(cart, dict)
        self.assertIsInstance(cart['item_id'], int)
        for key, value in product.items():
            self.assertEqual(cart[key], value)

    def test_get_cart_products(self):
        response = self.client.get(reverse('api:cart', kwargs={'cart_id': self.cart_id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        products = response.data
        self.assertIsInstance(products, list)
        self.assertGreater(len(products), 0)

        product = products[0]
        self.assertIsInstance(product['item_id'], int)
        self.assertIsInstance(product['product_id'], int)
        self.assertEqual(product['cart_id'], self.cart_id)
        self.assertGreater(len(product['name']), 0)
        self.assertIsNotNone(product['subtotal'])

    def test_update_item_quantity(self):
        item_id, quantity = 1, 4
        response = self.client.put(
            reverse('api:cart-items', kwargs={'pk': item_id}), {'quantity': quantity}, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        product = response.data
        self.assertIsInstance(product, dict)
        self.assertEqual(product['item_id'], item_id)
        self.assertEqual(product['quantity'], quantity)

    def test_empty_shopping_cart(self):
        response = self.client.delete(reverse('api:cart-empty', kwargs={'cart_id': self.cart_id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_remove_item(self):
        item_id = 1
        response = self.client.delete(reverse('api:cart-items-remove', kwargs={'pk': item_id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
