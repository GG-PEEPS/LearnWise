from django.contrib import admin
from .models import Subject, Document,Chat, PYQSubject, PYQquestions

# Register your models here.
admin.site.register(Document)
admin.site.register(Subject)
admin.site.register(Chat)
admin.site.register(PYQSubject)
admin.site.register(PYQquestions)