from rest_framework import serializers
from mCapture_app.models import Recebeimg


class RecebeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recebeimg
        fields = '__all__'