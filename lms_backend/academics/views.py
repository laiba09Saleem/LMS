from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Department, Semester, Subject, Resource
from .serializers import (
    DepartmentSerializer, SemesterSerializer, SubjectSerializer,
    ResourceSerializer, DepartmentDetailSerializer, SemesterDetailSerializer
)
from accounts.permissions import IsAdminOrSuperAdmin

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminOrSuperAdmin()]
        return [permissions.AllowAny()]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return DepartmentDetailSerializer
        return DepartmentSerializer
    
    @action(detail=True, methods=['get'])
    def semesters(self, request, pk=None):
        department = self.get_object()
        semesters = department.semesters.all()
        serializer = SemesterSerializer(semesters, many=True)
        return Response(serializer.data)

class SemesterViewSet(viewsets.ModelViewSet):
    queryset = Semester.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['department', 'number']
    search_fields = ['title', 'description']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminOrSuperAdmin()]
        return [permissions.AllowAny()]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SemesterDetailSerializer
        return SemesterSerializer
    
    @action(detail=True, methods=['get'])
    def subjects(self, request, pk=None):
        semester = self.get_object()
        subjects = semester.subjects.all()
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['semester', 'credits']
    search_fields = ['name', 'code', 'description']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminOrSuperAdmin()]
        return [permissions.AllowAny()]
    
    @action(detail=True, methods=['get'])
    def resources(self, request, pk=None):
        subject = self.get_object()
        resources = subject.resources.all()
        
        # Filter by type if provided
        resource_type = request.query_params.get('type')
        if resource_type:
            resources = resources.filter(type=resource_type)
        
        # Filter by public/private based on user role
        user = request.user
        if not user.is_authenticated or user.role not in ['admin', 'super_admin']:
            resources = resources.filter(is_public=True)
        
        serializer = ResourceSerializer(resources, many=True)
        return Response(serializer.data)

class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()  # ADD THIS LINE
    serializer_class = ResourceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['subject', 'type', 'is_public', 'uploaded_by']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'views', 'downloads']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminOrSuperAdmin()]
        return [permissions.AllowAny()]
    
    def get_queryset(self):
        queryset = Resource.objects.all()
        
        # Filter by public/private based on user role
        user = self.request.user
        if not user.is_authenticated or user.role not in ['admin', 'super_admin']:
            queryset = queryset.filter(is_public=True)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def increment_view(self, request, pk=None):
        resource = self.get_object()
        resource.views += 1
        resource.save()
        return Response({'views': resource.views})
    
    @action(detail=True, methods=['post'])
    def increment_download(self, request, pk=None):
        resource = self.get_object()
        resource.downloads += 1
        resource.save()
        return Response({'downloads': resource.downloads})