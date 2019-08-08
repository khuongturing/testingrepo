from django.conf import settings
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils import timezone

from .managers import UserManager, CustomerManager


class User(AbstractBaseUser, PermissionsMixin):

    name = models.CharField('Name', max_length=50)
    email = models.EmailField('Email', unique=True)
    is_staff = models.BooleanField('Staff', default=False)
    is_active = models.BooleanField('Active', default=True)
    date_joined = models.DateTimeField('Date Joined', default=timezone.now)

    objects = UserManager()

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'user'

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)


class Customer(User):

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, parent_link=True)
    customer_id = models.AutoField(primary_key=True)
    credit_card = models.TextField('Credit Card', null=True, blank=True)
    address_1 = models.CharField('Address', max_length=100, null=True, blank=True)
    address_2 = models.CharField('Another Address', max_length=100, null=True, blank=True)
    city = models.CharField('City', max_length=100, null=True, blank=True)
    region = models.CharField('Region', max_length=100, null=True, blank=True)
    postal_code = models.CharField('Postal Code', max_length=100, null=True, blank=True)
    country = models.CharField('Country', max_length=100, null=True, blank=True)
    day_phone = models.CharField('Day Phone', max_length=100, null=True, blank=True)
    eve_phone = models.CharField('Evening Phone', max_length=100, null=True, blank=True)
    mob_phone = models.CharField('Mobile Phone', max_length=100, null=True, blank=True)
    shipping_region = models.ForeignKey('orders.ShippingRegion', on_delete=models.PROTECT, default=1)

    objects = CustomerManager()

    class Meta:
        db_table = 'customer'

    def save(self, *args, **kwargs):
        self.is_staff = False
        self.is_superuser = False
        super(Customer, self).save(*args, **kwargs)