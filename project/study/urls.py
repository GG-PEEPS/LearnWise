from django.urls import include, path 
from . import views
from .seed import add_questions

urlpatterns = [
    path('getSubjects',views.get_subjects),
    path('addSubject',views.create_subject),
    path('getSubject/<int:subject_id>',views.subject_detail),
    path('addDocument/<int:subject_id>',views.add_document),
    path('getDocuments/<int:subject_id>',views.get_all_documents),
    path('deleteDocument/<int:document_id>',views.delete_document),
    path('getSubjectChats/<int:subject_id>',views.get_subject_chats),
    path('createChat/<int:subject_id>',views.create_chat),
    path('getFAQ/<int:subject_id>',views.get_faq),
    path('getTestSubjects',views.get_test_subjects),
    path('addQuestions',add_questions),
    path('getPYQ/<int:subject_id>',views.pyq_by_year_subject_view),
    path('getScore',views.scoreStudent),
    path('getAnswer',views.getAnswer),
    path('getTestSeries/<int:subject_id>',views.generateTest),
    path('pdfTestSeriesQuestions/<int:subject_id>',views.pdfTestSeriesQuestions),

]
