from django.contrib import admin
from .models import Subject, Document,Chat

# Register your models here.
admin.site.register(Document)
admin.site.register(Subject)
admin.site.register(Chat)