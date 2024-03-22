from django.urls import include, path 
from . import views

urlpatterns = [
    path('getSubjects',views.get_subjects),
    path('addSubject',views.create_subject),
    path('getSubject/<int:subject_id>',views.subject_detail),
]
