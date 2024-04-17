from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from sentence_transformers import SentenceTransformer, util

from .models import Subject,Document
from .serializers import SubjectSerializer, DocumentSerializer
from .chatviews import *
from .testSeriesviews import *
from .scorestudent import create_comparison_model, compare_answers
from .ragmodel import getFAQ
from django.conf import settings

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
    
@api_view(['GET'])
def get_faq(request,subject_id):
    embeddings_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=API_KEY)
    gemini_model = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=API_KEY, temperature=0.2, convert_system_message_to_human=True)
    print(subject_id)
    pdf_directory = os.getcwd()+"/study/mediafiles/notes/"+str(subject_id)
    vector_index = pdf2vec(pdf_directory,embeddings_model)

    x=getFAQ(gemini_model,vector_index)

    return Response(json.loads(x['result']),status=status.HTTP_200_OK)


@api_view(['POST'])
def scoreStudent(request):
    q = request.data['questions']
    a = request.data['answers']
    gemini_model = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=API_KEY, temperature=0.2, convert_system_message_to_human=True)
    sbert_model = SentenceTransformer("paraphrase-MiniLM-L6-v2")

    ai_answer = create_comparison_model(gemini_model,q)
    score = compare_answers(sbert_model,a,ai_answer)

    return Response(json.loads(score),status=status.HTTP_200_OK)

