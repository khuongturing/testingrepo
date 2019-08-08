from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from .models import Customer
User = get_user_model()


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = (
        (None, {'fields': ('password',)}),
        ('Personal info', {'fields': ('name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )

    list_display = ('name', 'email', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('name', 'email')
    ordering = ('name',)


@admin.register(Customer)
class CustomerAdmin(CustomUserAdmin):
    fieldsets = (
        (None, {'fields': ('password',)}),
        ('Personal info', {'fields': ('name', 'email', 'credit_card')}),
        ('Address', {'fields': ('address_1', 'address_2', 'city', 'region', 'postal_code', 'country')}),
        ('Contact Info', {'fields': ('day_phone', 'eve_phone', 'mob_phone')}),
        ('Permissions', {'fields': ('is_active', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    list_display = ('name', 'email')
    list_filter = ('is_active', 'groups')
