from rest_framework import serializers
from .models import Subject, Document, Chat

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'user']


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'subject', 'title', 'created_at', 'pdf_file']
    

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['id', 'subject', 'created_at', 'from_type', 'message']