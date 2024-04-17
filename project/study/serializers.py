from rest_framework import serializers
from django.core.files.uploadedfile import InMemoryUploadedFile
from io import BytesIO
from .models import Subject, Document, Chat, PYQSubject, PYQquestions
import os

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
        fields = ['id', 'subject', 'created_at', 'from_type', 'message', 'images']

    def create(self, validated_data):
        images_data = self.context.get('images')
        if images_data:
            # Assuming images_data is a list of JpegImageFile objects
            image_data = images_data[0]
            
            # Convert image data to a BytesIO buffer
            image_buffer = BytesIO()
            image_data.save(image_buffer, format='JPEG')
            
            # Create an InMemoryUploadedFile object
            image_name = os.path.basename(image_data.filename)
            image_file = InMemoryUploadedFile(image_buffer, None, image_name, 'image/jpeg', image_buffer.tell(), None)
            
            validated_data['images'] = image_file
        
        return super().create(validated_data)
    
class PYQSubjectSerialiser(serializers.ModelSerializer):
    class Meta:
        model=PYQSubject
        fields=['id','name']
    
class PYQQuestionSerialiser(serializers.ModelSerializer):
    class Meta:
        model=PYQquestions
        fields=['id','subject','question','created_at','year','marks']
    