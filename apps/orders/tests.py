from django.test import TestCase

from apps.orders.models import SHOPPING_CART_ID_LENGTH
from apps.orders.utils import generate_cart_id


class UtilsTestCase(TestCase):

    def test_generate_cart_id(self):
        id_1 = generate_cart_id()
        id_2 = generate_cart_id()

        self.assertEqual(len(id_1), SHOPPING_CART_ID_LENGTH)
        self.assertEqual(len(id_2), SHOPPING_CART_ID_LENGTH)

        self.assertNotEqual(id_1, id_2)