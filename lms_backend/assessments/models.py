from django.db import models
from django.utils import timezone

class Quiz(models.Model):
    quiz_id = models.AutoField(primary_key=True)
    subject = models.ForeignKey('academics.Subject', on_delete=models.CASCADE, related_name='quizzes')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='created_quizzes')
    time_limit = models.IntegerField(default=60)  # in minutes
    max_attempts = models.IntegerField(default=1)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        db_table = 'quizzes'

class Question(models.Model):
    class QuestionType(models.TextChoices):
        MULTIPLE_CHOICE = 'multiple_choice', 'Multiple Choice'
        TRUE_FALSE = 'true_false', 'True/False'
        SHORT_ANSWER = 'short_answer', 'Short Answer'
    
    question_id = models.AutoField(primary_key=True)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QuestionType.choices)
    options = models.JSONField(default=list, blank=True)  # For multiple choice
    correct_answer = models.TextField()
    points = models.IntegerField(default=1)
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return f"Q{self.order}: {self.question_text[:50]}"
    
    class Meta:
        db_table = 'questions'
        ordering = ['order']

class QuizSubmission(models.Model):
    submission_id = models.AutoField(primary_key=True)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='quiz_submissions')
    submitted_data = models.JSONField(default=dict)  # Store all answers
    score = models.FloatField(default=0)
    max_score = models.FloatField(default=0)
    is_completed = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(default=timezone.now)
    started_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.student.email} - {self.quiz.title}"
    
    class Meta:
        db_table = 'quiz_submissions'
        unique_together = ['quiz', 'student']

class Assignment(models.Model):
    assignment_id = models.AutoField(primary_key=True)
    subject = models.ForeignKey('academics.Subject', on_delete=models.CASCADE, related_name='assignments')
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='created_assignments')
    due_date = models.DateTimeField()
    max_points = models.IntegerField(default=100)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        db_table = 'assignments'

class AssignmentSubmission(models.Model):
    submission_id = models.AutoField(primary_key=True)
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='assignment_submissions')
    file_url = models.URLField(max_length=500, blank=True)
    file = models.FileField(upload_to='assignments/', null=True, blank=True)
    remarks = models.TextField(blank=True)
    score = models.IntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True)
    submitted_at = models.DateTimeField(default=timezone.now)
    graded_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.student.email} - {self.assignment.title}"
    
    class Meta:
        db_table = 'assignment_submissions'
        unique_together = ['assignment', 'student']