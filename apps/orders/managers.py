from django.db import models


class OrderManager(models.Manager):

    def add_items(self, cart_id, order):
        from .models import ShoppingCart, OrderDetail

        order_items = [
            OrderDetail(
                order=order,
                product=item.product,
                attributes=item.attributes,
                product_name=item.product.name,
                quantity=item.quantity,
                unit_cost=item.product.discounted_price or item.product.price
            )
            for item in ShoppingCart.objects.select_related('product').filter(cart_id=cart_id)
        ]

        order_amount = 0
        for item in order_items:
            order_amount += item.subtotal()
        order.total_amount = order_amount

        OrderDetail.objects.bulk_create(order_items)
        order.save(update_fields=['total_amount'])
