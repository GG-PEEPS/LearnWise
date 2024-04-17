from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .scorestudent import create_comparison_model, compare_answers

from .models import PYQSubject, PYQquestions
from .serializers import PYQSubjectSerialiser
from django.db.models import Count

@api_view(['GET'])
def get_test_subjects(request): 
    subjects = PYQSubject.objects.all()
    serializer = PYQSubjectSerialiser(subjects, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def pyq_by_year_subject_view(request, subject_id):
    if request.method == 'GET':
        # Group questions by year for the specified subject
        grouped_questions = PYQquestions.objects.filter(subject_id=subject_id).values('year').annotate(total_questions=Count('id')).order_by('year')

        # Prepare response data
        data = {}
        for entry in grouped_questions:
            year = entry['year']
            total_questions = entry['total_questions']
            questions = PYQquestions.objects.filter(subject_id=subject_id, year=year).values('question', 'marks')
            data[year] = {
                'total_questions': total_questions,
                'questions': list(questions)
            }

        return Response(data)
    



