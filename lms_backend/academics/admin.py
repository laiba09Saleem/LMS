from django.contrib import admin
from .models import Department, Semester, Subject, Resource

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name', 'description')

@admin.register(Semester)
class SemesterAdmin(admin.ModelAdmin):
    list_display = ('title', 'department', 'number', 'created_at')
    list_filter = ('department', 'number')
    search_fields = ('title', 'description')

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'semester', 'credits', 'created_at')
    list_filter = ('semester', 'credits')
    search_fields = ('name', 'code', 'description')

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'subject', 'uploaded_by', 'is_public', 'views', 'downloads', 'created_at')
    list_filter = ('type', 'is_public', 'subject')
    search_fields = ('title', 'description')