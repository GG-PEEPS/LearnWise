from django.db import models

from django.conf import settings
from django.utils import timezone

class Subject(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

def pdf_upload_path(instance, filename):
    return f'notes/{instance.subject.id}/{filename}'

def image_upload_path(instance, filename):
    return f'images/{instance.subject.id}/{filename}'

class Document(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    pdf_file = models.FileField(upload_to=pdf_upload_path,null=True, blank=True)

    def __str__(self):
        return self.title
    
class Chat(models.Model):
    SUBJECT_CHOICES = (
        ('USER', 'User'),
        ('SYSTEM', 'System'),
    )

    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    from_type = models.CharField(max_length=10, choices=SUBJECT_CHOICES)
    message = models.TextField()
    images = models.ImageField(upload_to=image_upload_path, null=True, blank=True)


    def __str__(self):
        return f"{self.from_type} - {self.subject.name} - {self.created_at}"
    

class PYQSubject(models.Model):
    name=models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class PYQquestions(models.Model):
    subject = models.ForeignKey(PYQSubject, on_delete=models.CASCADE)
    question = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    year=models.IntegerField()
    marks=models.IntegerField()

    def __str__(self):
        return self.question