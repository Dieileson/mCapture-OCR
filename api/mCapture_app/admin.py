from django.contrib import admin
from mCapture_app.models import Recebeimg


class Recebeimgs(admin.ModelAdmin):
    list_display = ('id', 'base64')

admin.site.register(Recebeimg, Recebeimgs)
