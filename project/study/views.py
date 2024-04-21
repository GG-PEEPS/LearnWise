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
def get_faq(request,subject_id):

    cached_answer=cache.get(subject_id)

    if cached_answer:
        return Response(cached_answer,status=status.HTTP_200_OK)


    if subject_id in FAQCache:
        return Response(FAQCache[subject_id],status=status.HTTP_200_OK)
#     if subject_id!=3:
#         time.sleep(3)
#         return Response({
#     "questions": [
#         {
#             "question": "What is information security?",
#             "answer": "Information security is the set of strategies for managing the processes, practices, policies and tools for protecting information assets and information systems from unauthorized access, use, disclosure, disruption, modification, or destruction while being stored or transmitted across."
#         },
#         {
#             "question": "What are the goals of information security?",
#             "answer": "The goals of information security are confidentiality, integrity, and availability."
#         },
#         {
#             "question": "What is confidentiality?",
#             "answer": "Confidentiality means that only the sender and intended receiver should be able to understand the contents of the transmitted message."
#         },
#         {
#             "question": "What is integrity?",
#             "answer": "Integrity means maintaining data in its correct state and preventing content of the communication or message not being altered, either maliciously or by accident, in transmission."
#         },
#         {
#             "question": "What is availability?",
#             "answer": "Availability means that data is available or accessible in a timely and reliable manner to authorized entities whenever needed."
#         },
#         {
#             "question": "What is a threat?",
#             "answer": "A threat is a potential loss or damage when a threat exploits a vulnerability."
#         },
#         {
#             "question": "What is a vulnerability?",
#             "answer": "A vulnerability is a flaw or weakness in a system’s design, implementation, or operation and management because of poor design, configuration mistakes, or inappropriate and insecure coding techniques which attackers can exploit to cause loss or harm."
#         },
#         {
#             "question": "What is an attack?",
#             "answer": "An attack is an assault on system security that derives from an intelligent threat, ie a deliberate attempt to evade security services and security policies of a system."
#         },
#         {
#             "question": "What are the different types of vulnerabilities?",
#             "answer": "The different types of vulnerabilities are hardware vulnerabilities, software vulnerabilities, and data vulnerabilities."
#         },
#         {
#             "question": "What are some examples of vulnerabilities?",
#             "answer": "Some examples of vulnerabilities include unpatched software, misconfiguration, weak credentials, phishing, web & ransomware, and trust relationship."
#         }
#     ]
# })
#     elif subject_id!=5:
        time.sleep(3)
        return Response({
    "questions": [
        {
            "question": "What is a requirement in the context of software engineering?",
            "answer": "A requirement is a function, constraint, or other property that the system must provide to fill the needs of the system's intended user(s)."
        },
        {
            "question": "What does the term 'engineering' imply in the context of requirements engineering?",
            "answer": "Engineering implies that systematic and repeatable techniques should be used in the process of defining, managing, and testing requirements for a product."
        },
        {
            "question": "What is the purpose of requirements engineering?",
            "answer": "Requirements engineering ensures that requirements for a product are defined, managed, and tested systematically, establishing a solid foundation for design and construction."
        },
        {
            "question": "Why is it essential for the software engineering team to understand the requirements of a problem before attempting to solve it?",
            "answer": "It is essential for the software engineering team to understand the requirements of a problem before attempting to solve it because without a clear understanding of the problem, the team may not be able to develop an effective solution that meets the needs of the users."
        },
        {
            "question": "What are the two main phases of requirements engineering?",
            "answer": "The two main phases of requirements engineering are requirements elicitation and requirements specification."
        },
        {
            "question": "What is the purpose of requirements elicitation?",
            "answer": "The purpose of requirements elicitation is to gather and understand the needs of the stakeholders and users of the system."
        },
        {
            "question": "What is the purpose of requirements specification?",
            "answer": "The purpose of requirements specification is to document the requirements in a formal and unambiguous manner."
        },
        {
            "question": "What are the characteristics of a good requirement?",
            "answer": "A good requirement is clear and unambiguous, correct, understandable, verifiable, complete, consistent, and traceable."
        },
        {
            "question": "Why is getting good requirements hard?",
            "answer": "Getting good requirements is hard because stakeholders may not know what they really want, may express requirements in their own terms, may have conflicting requirements, and may be influenced by organizational and political factors."
        },
        {
            "question": "What are the tasks involved in requirements engineering?",
            "answer": "The tasks involved in requirements engineering include inception, elicitation, elaboration, negotiation, specification, validation, and requirements management."
        },
        {
            "question": "What is the purpose of the inception phase in requirements engineering?",
            "answer": "The purpose of the inception phase is to establish a basic understanding of the problem and the nature of the solution."
        },
        {
            "question": "What is the purpose of the elicitation phase in requirements engineering?",
            "answer": "The purpose of the elicitation phase is to draw out the requirements from stakeholders."
        },
        {
            "question": "What are some of the problems that can occur during requirements elicitation?",
            "answer": "Some of the problems that can occur during requirements elicitation include problems of scope, problems of understanding, and problems of volatility."
        },
        {
            "question": "What is the purpose of the elaboration phase in requirements engineering?",
            "answer": "The purpose of the elaboration phase is to create an analysis model that represents information, functional, and behavioral aspects of the requirements."
        },
        {
            "question": "What is the purpose of the negotiation phase in requirements engineering?",
            "answer": "The purpose of the negotiation phase is to agree on a deliverable system that is realistic for developers and customers."
        },
        {
            "question": "What is the purpose of the specification phase in requirements engineering?",
            "answer": "The purpose of the specification phase is to describe the requirements formally or informally."
        },
        {
            "question": "What is the purpose of the validation phase in requirements engineering?",
            "answer": "The purpose of the validation phase is to review the requirement specification for errors, ambiguities, omissions, and conflicts."
        },
        {
            "question": "What is the purpose of requirements management?",
            "answer": "The purpose of requirements management is to manage changing requirements."
        },
        {
            "question": "What is the role of stakeholders in requirements engineering?",
            "answer": "Stakeholders play a crucial role in requirements engineering by providing input and feedback on the requirements."
        },
        {
            "question": "What are some of the challenges in working with stakeholders in requirements engineering?",
            "answer": "Some of the challenges in working with stakeholders in requirements engineering include managing conflicting interests, dealing with incomplete or changing requirements, and ensuring that all stakeholders are adequately represented."
        },
        {
            "question": "What are some of the best practices for requirements engineering?",
            "answer": "Some of the best practices for requirements engineering include involving stakeholders early and often, using a structured approach to requirements gathering and analysis, and documenting requirements clearly and concisely."
        }
    ]
})

    embeddings_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=API_KEY)
    # gemini_model = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=API_KEY, convert_system_message_to_human=True)
    pdf_directory = os.getcwd()+"/study/mediafiles/notes/"+str(subject_id)
    vector_index = pdf2vec(pdf_directory,embeddings_model)
    llm=ChatGroq(groq_api_key=groq_api_key,
             model_name="llama3-8b-8192")
    x=getFAQ(llm,vector_index)
    x = x['result']
    pattern = r'```(.+?)```'
    matches = re.findall(pattern, x, re.DOTALL)
    for match in matches:
        x = match.strip()
    # print(x)
    ctr = 0
    # while not x or ctr < 4:
    #     x = getFAQ(llm,vector_index)
    #     # x = parse_json_from_gemini(x['result']) 
    #     ctr +=1
    FAQCache[subject_id]=json.loads(x)
    cache.set(subject_id,json.loads(x),timeout=None)
    return Response(json.loads(x),status=status.HTTP_200_OK)


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

    gemini_model = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=API_KEY, temperature=0.7, convert_system_message_to_human=True)
    sbert_model = SentenceTransformer("paraphrase-MiniLM-L6-v2")

    ai_answer = create_comparison_model(gemini_model, q)
    ctr = 0
    while not ai_answer or ctr < 4:
        ai_answer = create_comparison_model(gemini_model,q)
        ai_answer = parse_json_from_gemini(ai_answer) 
        ctr +=1
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

    gemini_model = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=API_KEY, temperature=0.7, convert_system_message_to_human=True)

    ai_answer = create_comparison_model(gemini_model, q)
    ctr = 0
    while not ai_answer or ctr < 4:
        ai_answer = create_comparison_model(gemini_model,q)
        ai_answer = parse_json_from_gemini(ai_answer) 
        ctr +=1
    ans = {"question": q, "answer": ai_answer}

    cache.set(q, ans, timeout=None)  

    return Response(ans, status=status.HTTP_200_OK)