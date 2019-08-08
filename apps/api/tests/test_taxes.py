from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


class TaxTestCase(TestCase):

    fixtures = ('tax',)

    def setUp(self):
        self.client = APIClient()

    def test_taxes_list(self):

        response = self.client.get(reverse('api:taxes'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        taxes = response.data
        self.assertIsInstance(taxes, list)
        self.assertGreater(len(taxes), 0)
        self._test_tax(taxes[0])

    def test_tax(self):

        response = self.client.get(reverse('api:taxes', kwargs={'pk': 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        tax = response.data
        self.assertIsInstance(tax, dict)
        self._test_tax(tax)

    def _test_tax(self, tax):
        self.assertIsInstance(tax['tax_id'], int)
        self.assertIsInstance(tax['tax_type'], str)
        self.assertGreater(len(tax['tax_type']), 0)
