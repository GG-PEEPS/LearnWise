from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from sentence_transformers import SentenceTransformer
from django.db import models
import hashlib
from langchain_groq import ChatGroq
import re
from django.core.cache import cache
from django.views.decorators.cache import cache_page
from .models import Subject,Document
from .serializers import SubjectSerializer, DocumentSerializer
from .chatviews import *
from .testSeriesviews import *
from .scorestudent import create_comparison_model, compare_answers
from .ragmodel import getFAQ
from django.conf import settings
import time

groq_api_key=os.environ['GROQ_API_KEY']

@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def get_subjects(request):
    user = request.user
    subjects = Subject.objects.filter(user=user)
    serializer = SubjectSerializer(subjects, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def create_subject(request):
    user=request.user
    serializer = SubjectSerializer(data=request.data)
    serializer.initial_data['user'] = user.id
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes((IsAuthenticated,))
def subject_detail(request, subject_id):
    try:
        subject = Subject.objects.get(id=subject_id)
    except Subject.DoesNotExist:
        return Response({"error": "Subject not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SubjectSerializer(subject)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = SubjectSerializer(instance=subject, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        subject.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def add_document(request, subject_id):
    if request.method == 'POST':
        file_title = request.data.get('pdf_file').name 
        request.data['title'] = file_title 
        serializer = DocumentSerializer(data=request.data)
        serializer.initial_data['subject'] = subject_id
        if serializer.is_valid():
            serializer.save(subject_id=subject_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_document(request, document_id):
    try:
        document = Document.objects.get(id=document_id)
    except Document.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        file_path = os.path.join(settings.MEDIA_ROOT, str(document.pdf_file))
        if os.path.exists(file_path):
            os.remove(file_path)
        document.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

@api_view(['GET'])
def get_all_documents(request, subject_id):
    if request.method == 'GET':
        subject=Subject.objects.get(id=subject_id)
        documents = Document.objects.filter(subject_id=subject_id)
        serializer = DocumentSerializer(documents, many=True)
        return Response({
            "documents": serializer.data,
            "subject_name": subject.name
        })

FAQCache={}

@api_view(['GET'])
@cache_page(60 * 60)

def get_faq(request, subject_id):
    try:
        cached_answer = cache.get(subject_id)

        if cached_answer:
            return Response(cached_answer, status=status.HTTP_200_OK)

        embeddings_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=API_KEY)
        pdf_directory = os.getcwd() + "/study/mediafiles/notes/" + str(subject_id)
        vector_index = pdf2vec(pdf_directory, embeddings_model)
        model = "llama3-8b-8192"
        llm = ChatGroq(groq_api_key=groq_api_key, model_name=model)
        x = getFAQ(llm, vector_index)
        x = x['result']
        pattern = r'```json(.+?)```'
        matches = re.findall(pattern, x, re.DOTALL)
        for match in matches:
            x = match.strip()
        cache.set(subject_id, json.loads(x), timeout=None)
        x = json.loads(x)
        x = x['solutions']
        return Response(x, status=status.HTTP_200_OK)

    except Exception as e:
        # Handle the exception
        error_message = {"error": str(e)}
        print(e)
        return Response(error_message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@cache_page(60 * 60)
def scoreStudent(request):
    q = request.data['question']
    a = request.data['answer']
    
    # Hash the question-answer pair to use as cache key
    hash_key = hashlib.sha256((q + a).encode()).hexdigest()
    
    # Check if the response is already cached
    cached_score = cache.get(hash_key)
    if cached_score:
        return Response(cached_score, status=status.HTTP_200_OK)

    sbert_model = SentenceTransformer("paraphrase-MiniLM-L6-v2")

    ai_answer = create_comparison_model(q)
    semantic_score = compare_answers(sbert_model, a, ai_answer)
    score = {"score": semantic_score}

    cache.set(hash_key, score, timeout=None) 

    return Response(score, status=status.HTTP_200_OK)


@api_view(['POST'])
@cache_page(60 * 60)  
def getAnswer(request):
    q = request.data['question']
    
    cached_answer = cache.get(q)
    if cached_answer:
        return Response(cached_answer, status=status.HTTP_200_OK)


    ai_answer = create_comparison_model(q)
    print(ai_answer)

    ans = {"question": q, "answer": ai_answer}

    cache.set(q, ans, timeout=None)  

    return Response(ans, status=status.HTTP_200_OK)