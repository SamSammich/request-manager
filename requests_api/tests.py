from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase


class RequestAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='user1',
            password='password123'
        )

        self.user2 = User.objects.create_user(
            username='user2',
            password='password123'
        )

        self.admin = User.objects.create_user(
            username='admin',
            password='password123',
            is_staff=True
        )

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def create_request(
        self,
        user,
        title='Test request',
        priority='medium'
    ):
        self.authenticate(user)

        return self.client.post(
            '/api/auth/requests/',
            {
                'title': title,
                'description': 'Test description',
                'priority': priority,
            },
            format='json'
        )

    def test_create_request(self):
        response = self.create_request(self.user)

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )
        self.assertEqual(
            response.data['user'],
            self.user.username
        )
        self.assertEqual(
            response.data['status'],
            'new'
        )

    def test_user_sees_only_own_requests(self):
        self.create_request(
            self.user,
            'User 1 request'
        )
        self.create_request(
            self.user2,
            'User 2 request'
        )

        self.authenticate(self.user)

        response = self.client.get(
            '/api/auth/requests/'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )
        self.assertEqual(
            len(response.data['results']),
            1
        )
        self.assertEqual(
            response.data['results'][0]['title'],
            'User 1 request'
        )

    def test_admin_sees_all_requests(self):
        self.create_request(
            self.user,
            'User 1 request'
        )
        self.create_request(
            self.user2,
            'User 2 request'
        )

        self.authenticate(self.admin)

        response = self.client.get(
            '/api/auth/requests/'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )
        self.assertEqual(
            len(response.data['results']),
            2
        )

    def test_user_cannot_access_other_users_request(self):
        response = self.create_request(
            self.user2,
            'Private request'
        )

        request_id = response.data['id']

        self.authenticate(self.user)

        response = self.client.get(
            f'/api/auth/requests/{request_id}/'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

    def test_update_status(self):
        response = self.create_request(self.user)

        request_id = response.data['id']

        response = self.client.patch(
            f'/api/auth/requests/{request_id}/status/',
            {'status': 'in_progress'},
            format='json'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )
        self.assertEqual(
            response.data['status'],
            'in_progress'
        )

    def test_invalid_status(self):
        response = self.create_request(self.user)

        request_id = response.data['id']

        response = self.client.patch(
            f'/api/auth/requests/{request_id}/status/',
            {'status': 'invalid_status'},
            format='json'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

    def test_filter_by_priority(self):
        self.create_request(
            self.user,
            'Low request',
            priority='low'
        )

        self.create_request(
            self.user,
            'High request',
            priority='high'
        )

        self.authenticate(self.user)

        response = self.client.get(
            '/api/auth/requests/?priority=high'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )
        self.assertEqual(
            len(response.data['results']),
            1
        )
        self.assertEqual(
            response.data['results'][0]['title'],
            'High request'
        )