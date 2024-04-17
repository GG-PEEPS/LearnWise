from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import PYQQuestionSerialiser

@api_view(['POST'])
def add_questions(request):
    subject=request.data
    print(request.data, "hello")
    data=request.data
    for i in data["questions"]:
        i["subject"]=data["subject"]
        serializer=PYQQuestionSerialiser(data=i)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors)
    return Response({
        'subject':"subject added successfully"
    })