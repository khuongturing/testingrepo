from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


class AttributeTestCase(TestCase):

    fixtures = ('products', 'attributes_values', 'product_attributes')

    def setUp(self):
        self.client = APIClient()

    def test_attribute_list(self):
        response = self.client.get(reverse('api:attributes'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        attributes = response.data
        self.assertIsInstance(attributes, list)
        self.assertGreater(len(attributes), 0)
        self._test_attribute(attributes[0])

    def test_attribute(self):
        response = self.client.get(reverse('api:attributes', kwargs={'pk': 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self._test_attribute(response.data)

    def test_attribute_values_list(self):
        response = self.client.get(reverse('api:attribute-values', kwargs={'pk': 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        values = response.data
        self.assertIsInstance(values, list)
        self.assertGreater(len(values), 0)
        self._test_value(values[0])

    def test_product_attributes(self):
        response = self.client.get(reverse('api:product-attributes', kwargs={'pk': 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        attribute_values = response.data
        self.assertIsInstance(attribute_values, list)
        self.assertGreater(len(attribute_values), 0)

        attr_value = attribute_values[0]
        self.assertIsInstance(attr_value, dict)
        self.assertIsInstance(attr_value['attribute_value_id'], int)
        self.assertGreater(len(attr_value['attribute_name']), 0)
        self.assertGreater(len(attr_value['attribute_value']), 0)

    def _test_value(self, attr_value):
        self.assertIsInstance(attr_value, dict)
        self.assertIsInstance(attr_value['attribute_value_id'], int)
        self.assertIsInstance(attr_value['value'], str)
        self.assertGreater(len(attr_value['value']), 0)

    def _test_attribute(self, attribute):
        self.assertIsInstance(attribute, dict)
        self.assertIsInstance(attribute['attribute_id'], int)
        self.assertIsInstance(attribute['name'], str)
        self.assertGreater(len(attribute['name']), 0)
