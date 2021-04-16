from rest_framework import viewsets
from mCapture_app.models import Recebeimg
from mCapture_app.serializer import RecebeSerializer


class RecebeViewSet(viewsets.ModelViewSet):
    """Recebendo base64 e processado"""
    # Aula 3/2 Verificar processado
    queryset = Recebeimg.objects.all()
    serializer_class = RecebeSerializer