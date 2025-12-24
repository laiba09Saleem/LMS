from rest_framework import serializers
from assessments.models import Quiz, Question, QuizSubmission, Assignment, AssignmentSubmission
from accounts.serializers import UserSerializer
from academics.serializers import SubjectSerializer

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['question_id', 'quiz', 'question_text', 'question_type',
                 'options', 'correct_answer', 'points', 'order']
        read_only_fields = ['question_id']
        extra_kwargs = {
            'correct_answer': {'write_only': True}  # Don't expose correct answers in listing
        }

class QuizSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    questions_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Quiz
        fields = ['quiz_id', 'subject', 'subject_name', 'title', 'description',
                 'created_by', 'created_by_name', 'time_limit', 'max_attempts',
                 'is_published', 'questions_count', 'created_at', 'updated_at']
        read_only_fields = ['quiz_id', 'created_at', 'updated_at']
    
    def get_questions_count(self, obj):
        return obj.questions.count()

class QuizDetailSerializer(QuizSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta(QuizSerializer.Meta):
        fields = QuizSerializer.Meta.fields + ['questions']

class QuizSubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    
    class Meta:
        model = QuizSubmission
        fields = ['submission_id', 'quiz', 'quiz_title', 'student', 'student_name',
                 'submitted_data', 'score', 'max_score', 'is_completed',
                 'submitted_at', 'started_at']
        read_only_fields = ['submission_id', 'submitted_at']

class AssignmentSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    submissions_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Assignment
        fields = ['assignment_id', 'subject', 'subject_name', 'title', 'description',
                 'created_by', 'created_by_name', 'due_date', 'max_points',
                 'submissions_count', 'created_at', 'updated_at']
        read_only_fields = ['assignment_id', 'created_at', 'updated_at']
    
    def get_submissions_count(self, obj):
        return obj.submissions.count()

class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    assignment_title = serializers.CharField(source='assignment.title', read_only=True)
    
    class Meta:
        model = AssignmentSubmission
        fields = ['submission_id', 'assignment', 'assignment_title', 'student', 'student_name',
                 'file_url', 'file', 'remarks', 'score', 'feedback',
                 'submitted_at', 'graded_at']
        read_only_fields = ['submission_id', 'submitted_at', 'graded_at']