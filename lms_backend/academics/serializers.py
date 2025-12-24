from rest_framework import serializers
from academics.models import Department, Semester, Subject, Resource
from accounts.serializers import UserSerializer

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['department_id', 'name', 'description', 'created_at', 'updated_at']
        read_only_fields = ['department_id', 'created_at', 'updated_at']

class SemesterSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = Semester
        fields = ['semester_id', 'department', 'department_name', 'title', 
                 'number', 'description', 'created_at', 'updated_at']
        read_only_fields = ['semester_id', 'created_at', 'updated_at']

class SubjectSerializer(serializers.ModelSerializer):
    semester_title = serializers.CharField(source='semester.title', read_only=True)
    department_name = serializers.CharField(source='semester.department.name', read_only=True)
    
    class Meta:
        model = Subject
        fields = ['subject_id', 'semester', 'semester_title', 'department_name',
                 'name', 'description', 'code', 'credits', 'created_at', 'updated_at']
        read_only_fields = ['subject_id', 'created_at', 'updated_at']

class ResourceSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    
    class Meta:
        model = Resource
        fields = ['resource_id', 'subject', 'subject_name', 'uploaded_by', 'uploaded_by_name',
                 'type', 'title', 'description', 'file_url', 'file', 'is_public',
                 'views', 'downloads', 'created_at']
        read_only_fields = ['resource_id', 'views', 'downloads', 'created_at']
    
    def create(self, validated_data):
        validated_data['uploaded_by'] = self.context['request'].user
        return super().create(validated_data)

class DepartmentDetailSerializer(serializers.ModelSerializer):
    semesters = SemesterSerializer(many=True, read_only=True)
    
    class Meta:
        model = Department
        fields = ['department_id', 'name', 'description', 'semesters', 'created_at', 'updated_at']

class SemesterDetailSerializer(serializers.ModelSerializer):
    subjects = SubjectSerializer(many=True, read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = Semester
        fields = ['semester_id', 'department', 'department_name', 'title',
                 'number', 'description', 'subjects', 'created_at', 'updated_at']