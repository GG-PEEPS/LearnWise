from django.urls import include, path
from .views import assignments_list, toggle_assignment_completion,add_assignment,get_assignment,edit_assignment, get_assignment_with_deadlines

urlpatterns = [
    path('getAssignments',assignments_list),
    path('toggleAssignment',toggle_assignment_completion),
    path('addAssignment',add_assignment),
    path('getAssignment',get_assignment),
    path('editAssignment',edit_assignment),
    path('getAssignmentWithDeadlines',get_assignment_with_deadlines)
]
