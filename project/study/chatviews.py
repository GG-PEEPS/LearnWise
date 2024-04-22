from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
import uuid 
from django.core.files.uploadedfile import InMemoryUploadedFile

from io import BytesIO
from .models import Chat, Document
from .serializers import ChatSerializer, DocumentSerializer
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import os
from .ragmodel import pdf2vec, create_qa_chain_model
from .imagemodel import extract_images_from_pdf
import json
from dotenv import load_dotenv
load_dotenv()
API_KEY = os.getenv("API_KEY")

def image_upload_path(instance, filename):
    return f'images/{instance.subject.id}/{filename}'

@api_view(['GET'])
def get_subject_chats(request, subject_id):
    if request.method == 'GET':
        chats = Chat.objects.filter(subject_id=subject_id).order_by('created_at')
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data)
    
@api_view(['POST'])
def create_chat(request,subject_id):
    if request.method == 'POST':
        message = request.data.get('message')
        chat=Chat(subject_id=subject_id,from_type='USER',message=message)
        chat.save()

        embeddings_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=API_KEY)
        gemini_model = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=API_KEY, temperature=0.2, convert_system_message_to_human=True)
        pdf_directory = os.getcwd()+"/study/mediafiles/notes/"+str(subject_id)
        vector_index = pdf2vec(pdf_directory,embeddings_model)

        chats=Chat.objects.filter(subject_id=subject_id).order_by('created_at')
        chats=ChatSerializer(chats,many=True)
        x = create_qa_chain_model(gemini_model,vector_index,message)
        answer=x['result']

        images = extract_images_from_pdf(pdf_directory,message)
        if not images:
            uploaded_image=None
        for img in images:
            unique_filename = str(uuid.uuid4()) + '.jpg'
            images_io = BytesIO()
            img.save(images_io, format='JPEG')
            img.seek(0)
            uploaded_image = InMemoryUploadedFile(images_io, None, unique_filename, 'image/jpeg', images_io.getbuffer().nbytes, None)

        chat = Chat(subject_id=subject_id, from_type='SYSTEM', message=answer, images=uploaded_image)
        chat_serializer=ChatSerializer(chat)
        chat.save()
        chats=Chat.objects.filter(subject_id=subject_id).order_by('created_at')
        chat_serializer=ChatSerializer(chats,many=True)
        return Response(chat_serializer.data,status=status.HTTP_201_CREATED)
    



