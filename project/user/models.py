from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import UserManager

# Create your models here.
class CustomUser(AbstractUser):
    role=models.CharField(max_length=100,default="student")
    phone=models.CharField(max_length=10,default="1234567890")

    REQUIRED_FIELDS=['email','role','phone']
    objects = UserManager()

    def __str__(self):
        return self.username