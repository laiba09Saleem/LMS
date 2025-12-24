from django.contrib import admin
from .models import Setting, Notification, SystemLog

@admin.register(Setting)
class SettingAdmin(admin.ModelAdmin):
    list_display = ('key', 'value', 'description', 'created_at')
    search_fields = ('key', 'value', 'description')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'is_read', 'notification_type', 'created_at')
    list_filter = ('is_read', 'notification_type', 'user')
    search_fields = ('title', 'message', 'user__email')

@admin.register(SystemLog)
class SystemLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'ip_address', 'created_at')
    list_filter = ('action',)
    search_fields = ('action', 'user__email', 'ip_address')