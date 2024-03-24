from django.urls import include, path 
from . import views

urlpatterns = [
    path('getSubjects',views.get_subjects),
    path('addSubject',views.create_subject),
    path('getSubject/<int:subject_id>',views.subject_detail),
    path('addDocument/<int:subject_id>',views.add_document),
    path('getDocuments/<int:subject_id>',views.get_all_documents),
    path('deleteDocument/<int:document_id>',views.delete_document),
]