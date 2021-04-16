from rest_framework import serializers
from .models import leads_pf_model


class leads_pf_serializer(serializers.ModelSerializer):
    class Meta:
        model = leads_pf_model
        fields = '__all__'