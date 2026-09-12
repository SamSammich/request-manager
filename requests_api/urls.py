from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import RegisterView, RequestViewSet

router = DefaultRouter()
router.register(r'requests', RequestViewSet, basename='request')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('', include(router.urls)),
]