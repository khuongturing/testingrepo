from django.db import models

from .managers import OrderManager

SHOPPING_CART_ID_LENGTH = 30


class ShippingRegion(models.Model):

    shipping_region_id = models.AutoField(primary_key=True)
    shipping_region = models.CharField('Shipping Region', max_length=100)

    def __str__(self):
        return self.shipping_region

    class Meta:
        db_table = 'shipping_region'


class Tax(models.Model):

    tax_id = models.AutoField(primary_key=True)
    tax_type = models.CharField('Type', max_length=100)
    tax_percentage = models.DecimalField('Percentage', max_digits=10, decimal_places=2)

    def __str__(self):
        return self.tax_type

    class Meta:
        db_table = 'tax'


class Shipping(models.Model):

    shipping_id = models.AutoField(primary_key=True)
    shipping_type = models.CharField('Type', max_length=100)
    shipping_cost = models.DecimalField('Cost', max_digits=10, decimal_places=2)
    shipping_region = models.ForeignKey(ShippingRegion, on_delete=models.PROTECT)

    def __str__(self):
        return self.shipping_type

    class Meta:
        db_table = 'shipping'


class Order(models.Model):

    PROCESSING = 0
    CONFIRMED = 1
    CANCELLED = 2

    ORDER_CHOICES = (
        (PROCESSING, 'Processing'),
        (CONFIRMED, 'Confirmed'),
        (CANCELLED, 'Cancelled'),
    )

    order_id = models.AutoField(primary_key=True)
    total_amount = models.DecimalField('Total Amount', max_digits=10, decimal_places=2, default=0)
    created_on = models.DateTimeField('Created Time', auto_now_add=True)
    shipped_on = models.DateTimeField('Shipping Time', null=True, blank=True)
    status = models.IntegerField('Order Status', default=PROCESSING, choices=ORDER_CHOICES)
    comments = models.CharField('Comments', max_length=255, null=True, blank=True)
    customer = models.ForeignKey('users.Customer', on_delete=models.PROTECT, null=True)
    auth_code = models.CharField('Authentication Code', max_length=50, null=True, blank=True)
    reference = models.CharField('Reference', max_length=50, null=True, blank=True)
    shipping = models.ForeignKey(Shipping, on_delete=models.PROTECT, null=True)
    tax = models.ForeignKey(Tax, on_delete=models.PROTECT, null=True)

    objects = OrderManager()

    class Meta:
        db_table = 'orders'


class OrderDetail(models.Model):

    item_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey('products.Product', on_delete=models.PROTECT)
    attributes = models.CharField('Attributes', max_length=1000)
    product_name = models.CharField('Product Name', max_length=100)
    quantity = models.PositiveIntegerField('Quantity')
    unit_cost = models.DecimalField('Unit Cost', max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'order_detail'

    def subtotal(self):
        return self.unit_cost * self.quantity


class Audit(models.Model):

    audit_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    created_on = models.DateTimeField('Created Date', auto_now_add=True)
    message = models.TextField('Message')
    code = models.IntegerField('Code')

    class Meta:
        db_table = 'audit'


class ShoppingCart(models.Model):

    item_id = models.AutoField(primary_key=True)
    cart_id = models.CharField('Cart ID', max_length=32)
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    attributes = models.CharField('Attributes', max_length=1000)
    quantity = models.PositiveIntegerField('Quantity')
    buy_now = models.BooleanField('Buy Now', default=True)
    added_on = models.DateTimeField('Added Time', auto_now_add=True)

    def __str__(self):
        return self.cart_id

    class Meta:
        db_table = 'shopping_cart'
        indexes = [models.Index(fields=['cart_id'])]

    def subtotal(self):
        return self.quantity * (self.product.discounted_price or self.product.price)
