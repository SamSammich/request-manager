from django.contrib.auth.models import User
from django.db import IntegrityError, transaction

from rest_framework import serializers, status
from rest_framework.exceptions import APIException

from .models import Request


class ConflictError(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_code = 'conflict'


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        min_length=3,
        max_length=150,
        validators=[]
    )

    email = serializers.EmailField(
        required=True,
        validators=[]
    )

    password = serializers.CharField(
        write_only=True,
        min_length=8,
        max_length=128
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def validate(self, attrs):
        errors = {}

        if User.objects.filter(
            username=attrs['username']
        ).exists():
            errors['username'] = [
                'A user with that username already exists.'
            ]

        if User.objects.filter(
            email=attrs['email']
        ).exists():
            errors['email'] = [
                'A user with that email already exists.'
            ]

        if errors:
            raise ConflictError(errors)

        return attrs

    def create(self, validated_data):
        try:
            with transaction.atomic():
                return User.objects.create_user(
                    username=validated_data['username'],
                    email=validated_data['email'],
                    password=validated_data['password']
                )

        except IntegrityError:
            raise ConflictError({
                'detail': (
                    'A user with this username or email '
                    'already exists.'
                )
            })


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'is_staff',
            'date_joined',
        ]
        read_only_fields = [
            'id',
            'username',
            'is_staff',
            'date_joined',
        ]


class RequestSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source='user.username',
        read_only=True
    )

    class Meta:
        model = Request
        fields = [
            'id',
            'username',
            'title',
            'description',
            'status',
            'priority',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'username',
            'created_at',
            'updated_at',
        ]

    def validate_title(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError(
                'Title must contain at least 3 characters.'
            )

        return value

    def validate_description(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError(
                'Description must contain at least 10 characters.'
            )

        return value