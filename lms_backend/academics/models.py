from django.db import models
from django.utils import timezone

class Department(models.Model):
    department_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'departments'

class Semester(models.Model):
    semester_id = models.AutoField(primary_key=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='semesters')
    title = models.CharField(max_length=255)
    number = models.IntegerField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.department.name} - {self.title}"
    
    class Meta:
        db_table = 'semesters'
        unique_together = ['department', 'number']

class Subject(models.Model):
    subject_id = models.AutoField(primary_key=True)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='subjects')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    code = models.CharField(max_length=50, unique=True)
    credits = models.IntegerField(default=3)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    class Meta:
        db_table = 'subjects'

class Resource(models.Model):
    class ResourceType(models.TextChoices):
        NOTE = 'note', 'Note'
        BOOK = 'book', 'Book'
        PAST_PAPER = 'past_paper', 'Past Paper'
        VIDEO = 'video', 'Video'
        SLIDE = 'slide', 'Slide'
        OTHER = 'other', 'Other'
    
    resource_id = models.AutoField(primary_key=True)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='resources')
    uploaded_by = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='uploaded_resources')
    type = models.CharField(max_length=20, choices=ResourceType.choices)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file_url = models.URLField(max_length=500, blank=True)
    file = models.FileField(upload_to='resources/', null=True, blank=True)
    is_public = models.BooleanField(default=True)
    views = models.IntegerField(default=0)
    downloads = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return self.title
    
    class Meta:
        db_table = 'resources'