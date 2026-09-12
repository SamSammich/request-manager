from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Request

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )

class RequestSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Request
        fields = (
            'id',
            'title',
            'description',
            'status',
            'priority',
            'user',
            'created_at',
            'updated_at',
        )
        read_only_fields = (
            'id',
            'user',
            'created_at',
            'updated_at',
        )