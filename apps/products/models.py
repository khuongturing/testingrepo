from django.db import models

from .managers import ProductManager


class Attribute(models.Model):
    attribute_id = models.AutoField(primary_key=True)
    name = models.CharField('Name', max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'attribute'


class AttributeValue(models.Model):

    attribute_value_id = models.AutoField(primary_key=True)
    attribute = models.ForeignKey(Attribute, on_delete=models.CASCADE)
    value = models.CharField('Value', max_length=100)

    def __str__(self):
        return '{}: {}'.format(self.attribute, self.value)

    class Meta:
        db_table = 'attribute_value'


class Department(models.Model):

    department_id = models.AutoField(primary_key=True)
    name = models.CharField('Name', max_length=100)
    description = models.CharField('Description', max_length=1000, null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'department'


class Category(models.Model):

    category_id = models.AutoField(primary_key=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    name = models.CharField('Name', max_length=100)
    description = models.CharField('Description', max_length=1000, null=True, blank=True)

    def __str__(self):
        return '{}: {}'.format(self.department, self.name)

    class Meta:
        db_table = 'category'


class Product(models.Model):

    product_id = models.AutoField(primary_key=True)
    name = models.CharField('Name', max_length=100)
    description = models.CharField('Description', max_length=1000)
    price = models.DecimalField('Price', max_digits=10, decimal_places=2)
    discounted_price = models.DecimalField('Discounted Price', max_digits=10, decimal_places=2, default=0)
    image = models.CharField('Image', max_length=150, null=True, blank=True)
    image_2 = models.CharField('Another Image', max_length=150, null=True, blank=True)
    thumbnail = models.CharField('Thumbnail', max_length=150, null=True, blank=True)
    display = models.PositiveSmallIntegerField('Display', default=0)

    objects = ProductManager()

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'product'


class Review(models.Model):

    review_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey('users.Customer', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    review = models.TextField('Review')
    rating = models.PositiveSmallIntegerField('Rating')
    created_on = models.DateTimeField('Created Date', auto_now_add=True)

    class Meta:
        db_table = 'review'


class ProductAttribute(models.Model):

    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    attribute_value = models.ForeignKey(AttributeValue, on_delete=models.CASCADE)

    class Meta:
        db_table = 'product_attribute'
        unique_together = ('product', 'attribute_value')


class ProductCategory(models.Model):

    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    class Meta:
        db_table = 'product_category'
        unique_together = ('product', 'category')