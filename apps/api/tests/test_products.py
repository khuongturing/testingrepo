from django.http import QueryDict
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from apps.api.tests.utils import set_authorization_header


class ProductTestCase(TestCase):

    fixtures = ('shipping_regions', 'users', 'customers', 'tokens', 'departments', 'categories', 'products',
                'product_categories', 'reviews')

    token = '641ad88de5bf0f070c55813a95659e47c050b5f5'
    start_page = 1
    limit = 20
    description_length = 200

    def setUp(self):
        self.client = APIClient()

    def test_get_all_products_without_params(self):

        response = self.client.get(reverse('api:products'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data
        self._test_products(data)

    def test_get_all_products_with_params(self):

        params = {
            'page': 2,
            'limit': 15,
            'description_length': 150
        }

        q = QueryDict(mutable=True)
        q.update(params)

        response = self.client.get(reverse('api:products') + '?{}'.format(q.urlencode()))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data
        self._test_products(data, **params)

    def test_search_products(self):

        params = {
            'query_string': 'beautiful',
            'all_words': 'on'
        }

        q = QueryDict(mutable=True)
        q.update(params)

        response = self.client.get(reverse('api:search-products') + '?{}'.format(q.urlencode()))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_product_by_id(self):
        params = {
            'description_length': 150
        }

        q = QueryDict(mutable=True)
        q.update(params)

        response = self.client.get(reverse('api:products', kwargs={'pk': 1}) + '?{}'.format(q.urlencode()))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self._test_product(response.data, **params)

    def test_products_of_category(self):
        response = self.client.get(reverse('api:category-products', kwargs={'category_id': 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data
        self._test_products(data)

    def test_products_of_department(self):
        response = self.client.get(reverse('api:department-products', kwargs={'department_id': 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data
        self._test_products(data)

    def test_get_product_reviews(self):
        response = self.client.get(reverse('api:products-reviews', kwargs={'product_id': 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        reviews = response.data
        self.assertIsInstance(reviews, list)
        self.assertGreater(len(reviews), 0)

        self._test_review(reviews[0])

    def test_create_review(self):
        data = {
            'product_id': 1,
            'review': 'a very good review',
            'rating': 5,
        }

        set_authorization_header(self.client, self.token)

        response = self.client.post(reverse('api:products-reviews', kwargs={'product_id': 1}), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self._test_review(response.data)

    def test_create_review_without_token(self):

        response = self.client.post(reverse('api:products-reviews', kwargs={'product_id': 1}), {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def _test_review(self, review):
        self.assertGreater(len(review['name']), 0)
        self.assertGreater(len(review['review']), 0)
        self.assertIsInstance(review['rating'], int)
        self.assertIsNotNone(review['created_on'])

    def _test_products(self, data, **kwargs):
        self.assertIsInstance(data, dict)

        meta = data['paginationMeta']
        self.assertIsInstance(meta['currentPage'], int)
        self.assertIsInstance(meta['currentPageSize'], int)
        self.assertIsInstance(meta['totalPages'], int)
        self.assertIsInstance(meta['totalRecords'], int)

        self.assertEqual(meta['currentPage'], kwargs.get('page', self.start_page))
        self.assertLessEqual(meta['currentPageSize'], kwargs.get('limit', self.limit))

        products = data['rows']
        self.assertIsInstance(products, list)
        self.assertGreater(len(products), 0)

        self._test_list_product(products[0], **kwargs)

    def _test_list_product(self, product, description_length=description_length, **kwargs):

        self.assertIsInstance(product, dict)
        self.assertIsInstance(product['product_id'], int)
        self.assertGreater(len(product['name']), 0)
        self.assertGreater(len(product['description']), 0)
        self.assertLessEqual(len(product['description']), description_length)
        self.assertIsNotNone(product['price'])
        self.assertIsNotNone(product['discounted_price'])
        self.assertIsNotNone(product['thumbnail'])

    def _test_product(self, product, description_length=description_length, **kwargs):
        self._test_list_product(product, description_length)
        self.assertIsNotNone(product['image'])
        self.assertIsNotNone(product['image_2'])
        self.assertIsNotNone(product['display'])


