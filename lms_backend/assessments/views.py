from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Quiz, Question, QuizSubmission, Assignment, AssignmentSubmission
from .serializers import (
    QuizSerializer, QuizDetailSerializer, QuestionSerializer,
    QuizSubmissionSerializer, AssignmentSerializer, AssignmentSubmissionSerializer
)
from accounts.permissions import IsAdminOrSuperAdmin, IsOwnerOrAdmin

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()  # ADD THIS LINE
    serializer_class = QuizSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['subject', 'created_by', 'is_published']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminOrSuperAdmin()]
        elif self.action == 'submit':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def get_queryset(self):
        queryset = Quiz.objects.all()
        
        # Only show published quizzes to non-admins
        user = self.request.user
        if not user.is_authenticated or user.role not in ['admin', 'super_admin']:
            queryset = queryset.filter(is_published=True)
        
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return QuizDetailSerializer
        return QuizSerializer
    
    @action(detail=True, methods=['get'])
    def questions(self, request, pk=None):
        quiz = self.get_object()
        
        # Don't show correct answers to students
        user = request.user
        if user.role in ['admin', 'super_admin']:
            questions = quiz.questions.all()
        else:
            questions = quiz.questions.all()
            for question in questions:
                question.correct_answer = ''
        
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def submit(self, request, pk=None):
        quiz = self.get_object()
        student = request.user
        
        # Check if student has remaining attempts
        submissions_count = QuizSubmission.objects.filter(quiz=quiz, student=student).count()
        if submissions_count >= quiz.max_attempts:
            return Response(
                {'error': 'Maximum attempts reached'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate score
        submitted_data = request.data.get('answers', {})
        total_score = 0
        max_score = 0
        
        for question in quiz.questions.all():
            max_score += question.points
            student_answer = submitted_data.get(str(question.question_id), '').strip()
            
            if question.question_type == 'multiple_choice':
                if student_answer == question.correct_answer:
                    total_score += question.points
            elif question.question_type == 'true_false':
                if student_answer.lower() == question.correct_answer.lower():
                    total_score += question.points
            # Add more question type handling as needed
        
        # Create submission
        submission = QuizSubmission.objects.create(
            quiz=quiz,
            student=student,
            submitted_data=submitted_data,
            score=total_score,
            max_score=max_score,
            is_completed=True
        )
        
        serializer = QuizSubmissionSerializer(submission)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['subject', 'created_by']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminOrSuperAdmin()]
        return [permissions.IsAuthenticated()]
    
    @action(detail=True, methods=['get'])
    def submissions(self, request, pk=None):
        assignment = self.get_object()
        user = request.user
        
        if user.role in ['admin', 'super_admin']:
            submissions = assignment.submissions.all()
        else:
            submissions = assignment.submissions.filter(student=user)
        
        serializer = AssignmentSubmissionSerializer(submissions, many=True)
        return Response(serializer.data)

class AssignmentSubmissionViewSet(viewsets.ModelViewSet):
    queryset = AssignmentSubmission.objects.all()  # ADD THIS LINE
    serializer_class = AssignmentSubmissionSerializer
    
    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAdminOrSuperAdmin()]
        elif self.action == 'grade':
            return [IsAdminOrSuperAdmin()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role in ['admin', 'super_admin']:
            return AssignmentSubmission.objects.all()
        
        # Students can only see their own submissions
        return AssignmentSubmission.objects.filter(student=user)
    
    def perform_create(self, serializer):
        serializer.save(student=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrSuperAdmin])
    def grade(self, request, pk=None):
        submission = self.get_object()
        score = request.data.get('score')
        feedback = request.data.get('feedback', '')
        
        if score is None:
            return Response(
                {'error': 'Score is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        submission.score = score
        submission.feedback = feedback
        submission.graded_at = timezone.now()
        submission.save()
        
        serializer = self.get_serializer(submission)
        return Response(serializer.data)