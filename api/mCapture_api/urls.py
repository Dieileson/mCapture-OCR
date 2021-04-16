from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include
from mCapture_app.views import RecebeViewSet
from rest_framework import routers
from api_ocr.views import hello_from_new_way


router = routers.DefaultRouter()
router.register('recebe', RecebeViewSet, basename='Recebe')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    url(r'^api/ocr/$',hello_from_new_way),
]
