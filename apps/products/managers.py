from django.db import models

from tshirtshop.utils import execute_raw_sql


class ProductManager(models.Manager):

    search_sql = "SELECT product_id FROM product WHERE MATCH (name, description) AGAINST (%(value)s"

    def search(self, value, boolean_mode=True):
        if boolean_mode:
            sql = '{} IN BOOLEAN MODE);'.format(self.search_sql)
        else:
            sql = '{});'.format(self.search_sql)
        result = execute_raw_sql(sql, params={'value': value})
        return [product['product_id'] for product in result]
