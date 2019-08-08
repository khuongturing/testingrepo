from rest_framework import serializers

from apps.orders.models import Tax


class TaxSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tax
        fields = '__all__'
