from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import PYQSubject
from .serializers import PYQSubjectSerialiser

@api_view(['GET'])
def get_test_subjects(request): 
    subjects = PYQSubject.objects.all()
    serializer = PYQSubjectSerialiser(subjects, many=True)
    return Response(serializer.data)