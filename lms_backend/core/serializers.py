from rest_framework import serializers
from core.models import Setting, Notification, SystemLog
from accounts.serializers import UserSerializer

class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = ['setting_id', 'key', 'value', 'description', 'created_at', 'updated_at']
        read_only_fields = ['setting_id', 'created_at', 'updated_at']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['notification_id', 'user', 'title', 'message', 'is_read',
                 'notification_type', 'related_url', 'created_at']
        read_only_fields = ['notification_id', 'created_at']

class SystemLogSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True, allow_null=True)
    
    class Meta:
        model = SystemLog
        fields = ['log_id', 'user', 'user_email', 'action', 'details',
                 'ip_address', 'user_agent', 'created_at']
        read_only_fields = ['log_id', 'created_at']