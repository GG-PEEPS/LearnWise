from django.urls import include, path
from .views import assignments_list, toggle_assignment_completion,add_assignment

urlpatterns = [
    path('getAssignments',assignments_list),
    path('toggleAssignment',toggle_assignment_completion),
    path('addAssignment',add_assignment),
]
