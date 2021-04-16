from django.db import models


class Recebeimg(models.Model):
    base64 = models.TextField()
    processado = models.BooleanField()

    def __str__(self):
        return self.base64