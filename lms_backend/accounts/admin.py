from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, UserProfile

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'name', 'role', 'status', 'is_staff', 'is_active')
    list_filter = ('role', 'status', 'is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('name',)}),
        ('Permissions', {'fields': ('role', 'status', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'created_at')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2', 'role', 'is_staff', 'is_active'),
        }),
    )
    search_fields = ('email', 'name')
    ordering = ('email',)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'department', 'semester')
    list_filter = ('department', 'semester')
    search_fields = ('user__email', 'user__name', 'phone')