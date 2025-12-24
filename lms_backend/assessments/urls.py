from django.urls import path, include
from rest_framework.routers import DefaultRouter
from assessments.views import QuizViewSet, AssignmentViewSet, AssignmentSubmissionViewSet

router = DefaultRouter()
router.register(r'quizzes', QuizViewSet)
router.register(r'assignments', AssignmentViewSet)
router.register(r'submissions', AssignmentSubmissionViewSet, basename='submission')

urlpatterns = [
    path('', include(router.urls)),
]