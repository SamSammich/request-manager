from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Request


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        max_length=128
    )

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                'Пользователь с таким username уже существует.'
            )
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                'Пользователь с таким email уже существует.'
            )
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )


class RequestSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    title = serializers.CharField(
        min_length=3,
        max_length=255
    )

    description = serializers.CharField(
        min_length=10,
        max_length=5000
    )

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