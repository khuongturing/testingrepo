from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


class DepartmentTestCase(TestCase):

    fixtures = ('departments',)

    def setUp(self):
        self.client = APIClient()

    def test_departments_list(self):

        response = self.client.get(reverse('api:departments'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        departments = response.data
        self.assertIsInstance(departments, list)
        self.assertGreater(len(departments), 0)
        self._test_department(departments[0])

    def test_department(self):

        response = self.client.get(reverse('api:departments', kwargs={'pk': 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        department = response.data
        self.assertIsInstance(department, dict)
        self._test_department(department)

    def _test_department(self, department):
        self.assertIsInstance(department['department_id'], int)
        self.assertIsInstance(department['name'], str)
        self.assertGreater(len(department['name']), 0)
