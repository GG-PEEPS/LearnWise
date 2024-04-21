from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
import json
from .scorestudent import getTestSeriesQuestions, getMCQs, parse_json_from_gemini

from .models import PYQSubject, PYQquestions, Subject
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
        grouped_questions = PYQquestions.objects.filter(subject_id=subject_id).values('year').annotate(total_questions=Count('id')).order_by('year')

        # Prepare response data
        data = []
        for entry in grouped_questions:
            year = entry['year']
            total_questions = entry['total_questions']
            questions = PYQquestions.objects.filter(subject_id=subject_id, year=year).values('question', 'marks')
            data.append({
                'year': year,
                'total_questions': total_questions,
                'questions': list(questions)
            })

        return Response(data)
    
@api_view(['GET'])
def generateTest(request, subject_id):
    if request.method == 'GET':
        all_questions = PYQquestions.objects.filter(subject_id=subject_id)
        ten_marks_q = []
        five_marks_q = []
        test = []
        for question in all_questions:
            if question.marks == 5:
                five_marks_q.append({
                'question': question.question,
                'marks': question.marks
            })
            else:
                ten_marks_q.append({
                    'question': question.question,
                    'marks': question.marks
                })
        
        five_marks = getTestSeriesQuestions(five_marks_q,250)
        five_marks = parse_json_from_gemini(five_marks)
        ctr = 0
        while not five_marks or ctr < 4:
            five_marks = getTestSeriesQuestions(five_marks_q,250)
            five_marks = parse_json_from_gemini(five_marks) 
            ctr +=1
        test.append(
            {
                "questions" : five_marks,
                "marks" : 5
            })
        ten_marks = getTestSeriesQuestions(ten_marks_q,500)
        ten_marks = parse_json_from_gemini(ten_marks)
        ctr = 0
        while not ten_marks or ctr < 4:
            ten_marks = getTestSeriesQuestions(ten_marks_q,250)
            ten_marks = parse_json_from_gemini(ten_marks) 
            ctr +=1        
        test.append(
            {
                "questions" : ten_marks,
                "marks" : 10
            })
        subject = Subject.objects.get(pk=subject_id)
        x = getMCQs(subject.name)
        x = parse_json_from_gemini(x)
        test.append({"questions": x,
                    "marks" : 1})

        

        return Response(test)



