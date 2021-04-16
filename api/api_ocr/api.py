from .models import leads_pf_model
from rest_framework import viewsets, permissions
from .serializers import leads_pf_serializer


class leads_pf_viewset(viewsets.ModelViewSet):
      
    queryset = leads_pf_model.objects.all()

    
    permission_classes = [
        permissions.AllowAny,
    ]
    serializer_class = leads_pf_serializer
