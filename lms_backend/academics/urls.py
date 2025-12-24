from django.urls import path, include
from rest_framework.routers import DefaultRouter
from academics.views import DepartmentViewSet, SemesterViewSet, SubjectViewSet, ResourceViewSet

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet)
router.register(r'semesters', SemesterViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'resources', ResourceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]