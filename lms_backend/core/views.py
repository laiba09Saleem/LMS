from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from core.models import Setting, Notification, SystemLog
from core.serializers import SettingSerializer, NotificationSerializer, SystemLogSerializer
from accounts.permissions import IsSuperAdmin, IsAdminOrSuperAdmin

class SettingViewSet(viewsets.ModelViewSet):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    permission_classes = [IsSuperAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['key']
    
    @action(detail=False, methods=['get'])
    def public(self, request):
        # Expose only public settings (you can define which keys are public)
        public_keys = ['site_title', 'site_description', 'contact_email', 'max_file_size']
        settings = Setting.objects.filter(key__in=public_keys)
        serializer = self.get_serializer(settings, many=True)
        return Response(serializer.data)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        notifications = self.get_queryset().filter(is_read=False)
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        updated = self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({'marked_read': updated})

class SystemLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SystemLog.objects.all()
    serializer_class = SystemLogSerializer
    permission_classes = [IsSuperAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'action']
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        logs = SystemLog.objects.all()[:100]
        serializer = self.get_serializer(logs, many=True)
        return Response(serializer.data)