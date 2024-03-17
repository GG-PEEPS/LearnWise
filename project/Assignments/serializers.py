from rest_framework import serializers
from .models import Assignments

class AssignmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignments
        fields = ['id', 'user', 'title', 'platform', 'deadline', 'completed']
