from django.contrib import admin
from .models import Subject, Document

# Register your models here.
admin.site.register(Document)
admin.site.register(Subject)