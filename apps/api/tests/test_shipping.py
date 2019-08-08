from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


class ShippingTestCase(TestCase):

    fixtures = ('shipping_regions', 'shippings')

    def setUp(self):
        self.client = APIClient()

    def test_shipping_regions(self):
        response = self.client.get(reverse('api:shipping-regions'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        regions = response.data
        self.assertIsInstance(regions, list)
        self.assertGreater(len(regions), 0)

        region = regions[0]
        self.assertIsInstance(region['shipping_region_id'], int)
        self.assertGreater(len(region['shipping_region']), 0)

    def test_region_shippings(self):
        response = self.client.get(reverse('api:region-shippings', kwargs={'pk': 2}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        shippings = response.data
        self.assertIsInstance(shippings, list)
        self.assertGreater(len(shippings), 0)

        shipping = shippings[0]
        self.assertIsInstance(shipping['shipping_id'], int)
        self.assertIsInstance(shipping['shipping_region_id'], int)
        self.assertGreater(len(shipping['shipping_type']), 0)