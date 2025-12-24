from django.contrib import admin
from .models import Quiz, Question, QuizSubmission, Assignment, AssignmentSubmission

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'created_by', 'time_limit', 'max_attempts', 'is_published', 'created_at')
    list_filter = ('subject', 'is_published', 'created_by')
    search_fields = ('title', 'description')

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'quiz', 'question_type', 'points', 'order')
    list_filter = ('question_type', 'quiz')
    search_fields = ('question_text',)

@admin.register(QuizSubmission)
class QuizSubmissionAdmin(admin.ModelAdmin):
    list_display = ('quiz', 'student', 'score', 'max_score', 'is_completed', 'submitted_at')
    list_filter = ('quiz', 'student', 'is_completed')
    search_fields = ('student__email', 'quiz__title')

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'created_by', 'due_date', 'max_points', 'created_at')
    list_filter = ('subject', 'created_by')
    search_fields = ('title', 'description')

@admin.register(AssignmentSubmission)
class AssignmentSubmissionAdmin(admin.ModelAdmin):
    list_display = ('assignment', 'student', 'score', 'submitted_at', 'graded_at')
    list_filter = ('assignment', 'student')
    search_fields = ('student__email', 'assignment__title')