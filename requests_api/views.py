from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User

from .models import Request
from .serializers import RegisterSerializer, RequestSerializer, UserSerializer
from .filters import RequestFilter


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return User.objects.all()

        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='statistics')
    def statistics(self, request):
        if not request.user.is_staff:
            return Response(
                {'detail': 'Only administrators can access statistics.'},
                status=status.HTTP_403_FORBIDDEN
            )

        users = User.objects.all().order_by('id')
        serializer = self.get_serializer(users, many=True)

        return Response({
            'count': users.count(),
            'users': serializer.data,
        })

class IsAdminOrOwner(permissions.BasePermission):
    """
    Администратор может работать со всеми заявками.
    Обычный пользователь — только со своими заявками.
    """

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True

        return obj.user == request.user


class RequestViewSet(viewsets.ModelViewSet):
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]

    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = RequestFilter
    search_fields = ['title', 'description']

    def get_queryset(self):
        queryset = Request.objects.all()

        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['patch'], url_path='status')
    def update_status(self, request, pk=None):
        instance = self.get_object()
        new_status = request.data.get('status')

        if new_status is None:
            return Response(
                {'detail': 'status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        valid_statuses = Request.Status.values

        if new_status not in valid_statuses:
            return Response(
                {
                    'detail': 'Invalid status',
                    'allowed_statuses': valid_statuses,
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        instance.status = new_status
        instance.save(update_fields=['status', 'updated_at'])

        return Response(
            {'status': instance.status},
            status=status.HTTP_200_OK
        )