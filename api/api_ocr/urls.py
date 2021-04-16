from rest_framework import  routers
from .api import leads_pf_viewset

from django.utils.safestring import mark_safe




router = routers.DefaultRouter()
router.get_api_root_view().cls.__name__ = "Root API name"
router.get_api_root_view().cls.__doc__ = "Your Description"
router.register('api/ocr/', leads_pf_viewset, 'api_ocr')

urlpatterns = router.urls