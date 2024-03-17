from django.db import models
from django.conf import settings

class Assignments(models.Model):
    GOOGLECLASSROOM = 'GOOGLECLASSROOM'
    LMS = 'LMS'
    TEAMS = 'TEAMS'

    PLATFORM_CHOICES = [
        (GOOGLECLASSROOM, 'Google Classroom'),
        (LMS, 'LMS'),
        (TEAMS, 'Teams'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    deadline = models.DateTimeField()
    completed = models.BooleanField(default=False)  # New field indicating completion status

    def __str__(self):
        return self.title
