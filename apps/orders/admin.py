from django.contrib import admin
from django.contrib.admin import ModelAdmin

from .models import ShoppingCart, Order, OrderDetail

admin.site.register(ShoppingCart)


class OrderDetailInline(admin.TabularInline):
    model = OrderDetail
    extra = 1


@admin.register(Order)
class OrderAdmin(ModelAdmin):
    list_display = ('order_id', 'customer')
    inlines = (OrderDetailInline,)
