# Generated by Django 2.2.3 on 2019-07-28 22:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0001_initial'),
        ('orders', '0002_auto_20190728_2229'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='customer',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='users.Customer'),
        ),
        migrations.AddField(
            model_name='order',
            name='shipping',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='orders.Shipping'),
        ),
        migrations.AddField(
            model_name='order',
            name='tax',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='orders.Tax'),
        ),
        migrations.AddField(
            model_name='audit',
            name='order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='orders.Order'),
        ),
        migrations.AddIndex(
            model_name='shoppingcart',
            index=models.Index(fields=['cart_id'], name='shopping_ca_cart_id_c0c392_idx'),
        ),
    ]
