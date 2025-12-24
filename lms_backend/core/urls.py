from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import SettingViewSet, NotificationViewSet, SystemLogViewSet

router = DefaultRouter()
router.register(r'settings', SettingViewSet)
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'logs', SystemLogViewSet, basename='log')

urlpatterns = [
    path('', include(router.urls)),
]