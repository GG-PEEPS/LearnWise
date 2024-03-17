from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Assignments
from .serializers import AssignmentsSerializer
from django.utils import timezone

@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def assignments_list(request):
    user = request.user  # Assuming user is authenticated
    now = timezone.now()
    assignments = Assignments.objects.filter(user=user)

    pending_assignments = []
    overdue_assignments = []
    completed_assignments = []
    for assignment in assignments:
        if assignment.completed:
            completed_assignments.append(assignment)
        elif assignment.deadline < now:
            overdue_assignments.append(assignment)
        else:
            pending_assignments.append(assignment)

    pending_serializer = AssignmentsSerializer(pending_assignments, many=True)
    overdue_serializer = AssignmentsSerializer(overdue_assignments, many=True)
    completed_serializer = AssignmentsSerializer(completed_assignments, many=True)

    return Response({
        'pending_assignments': pending_serializer.data,
        'overdue_assignments': overdue_serializer.data,
        'completed_assignments': completed_serializer.data
    })


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def toggle_assignment_completion(request):

    assignment_id = request.data.get('assignmentId')

    if assignment_id is None:
        return Response({"error": "Assignment ID is required"}, status=400)

    try:
        assignment = Assignments.objects.get(id=assignment_id)
    except Assignments.DoesNotExist:
        return Response({"error": "Assignment not found"}, status=404)

    assignment.completed = not assignment.completed
    assignment.save()

    user = request.user
    assignments = Assignments.objects.filter(user=user)

    pending_assignments = []
    overdue_assignments = []
    completed_assignments = []
    for assignment in assignments:
        if assignment.completed:
            completed_assignments.append(assignment)
        elif assignment.deadline < timezone.now():
            overdue_assignments.append(assignment)
        else:
            pending_assignments.append(assignment)

    pending_serializer = AssignmentsSerializer(pending_assignments, many=True)
    overdue_serializer = AssignmentsSerializer(overdue_assignments, many=True)
    completed_serializer = AssignmentsSerializer(completed_assignments, many=True)

    return Response({
        'pending_assignments': pending_serializer.data,
        'overdue_assignments': overdue_serializer.data,
        'completed_assignments': completed_serializer.data
    })


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def add_assignment(request):
    user = request.user  # Assuming user is authenticated

    serializer = AssignmentsSerializer(data=request.data)
    serializer.initial_data['user'] = user.id
    if serializer.is_valid():
        serializer.save(user=user)
        
        assignments = Assignments.objects.filter(user=user)

        pending_assignments = []
        overdue_assignments = []
        completed_assignments = []
        for assignment in assignments:
            if assignment.completed:
                completed_assignments.append(assignment)
            elif assignment.deadline < timezone.now():
                overdue_assignments.append(assignment)
            else:
                pending_assignments.append(assignment)

        pending_serializer = AssignmentsSerializer(pending_assignments, many=True)
        overdue_serializer = AssignmentsSerializer(overdue_assignments, many=True)
        completed_serializer = AssignmentsSerializer(completed_assignments, many=True)

        return Response({
            'pending_assignments': pending_serializer.data,
            'overdue_assignments': overdue_serializer.data,
            'completed_assignments': completed_serializer.data
        })
    else:
        return Response(serializer.errors, status=400)