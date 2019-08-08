from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


class CategoryTestCase(TestCase):

    fixtures = ('departments', 'categories', 'products', 'product_categories')

    def setUp(self):
        self.client = APIClient()

    def test_category_list(self):
        response = self.client.get(reverse('api:categories'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        categories = response.data['rows']
        self.assertIsInstance(categories, list)
        self.assertGreater(len(categories), 0)
        self._test_category(categories[0])

    def test_category(self):
        response = self.client.get(reverse('api:categories', kwargs={'pk': 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        category = response.data
        self.assertIsInstance(category, dict)
        self._test_category(category)

    def test_product_category(self):
        response = self.client.get(reverse('api:product-category', kwargs={'pk': 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        category = response.data
        self.assertIsInstance(category, dict)
        self._test_category(category)

    def test_department_categories(self):
        response = self.client.get(reverse('api:department-categories', kwargs={'pk': 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        categories = response.data['rows']
        self.assertIsInstance(categories, list)
        self.assertGreater(len(categories), 0)
        self._test_category(categories[0])

    def _test_category(self, category):
        self.assertIsInstance(category['category_id'], int)
        self.assertIsInstance(category['department_id'], int)
        self.assertIsInstance(category['name'], str)
        self.assertGreater(len(category['name']), 0)
