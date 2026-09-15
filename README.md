#Русская версия
#О проекте

#Request Manager — полнофункциональная система управления заявками, разработанная с использованием Django REST Framework и React.

##Приложение позволяет пользователям создавать и управлять своими заявками, а администраторам — управлять всеми заявками и пользователями через отдельную административную панель.

###Возможности:
Авторизация и пользователи
Регистрация пользователей
JWT-аутентификация
Access и refresh токены
Получение информации о текущем пользователе
Роли пользователей:
    Обычный пользователь
    Администратор

###Управление заявками:
Создание заявок
Просмотр заявок
Редактирование заявок
Удаление заявок
Изменение статуса заявки
Привязка заявки к пользователю
Администратор может управлять всеми заявками
Обычный пользователь может управлять только своими заявками


###Поиск, фильтрация и пагинация
Поиск по названию и описанию
Фильтрация по статусу
Фильтрация по приоритету
Фильтрация по дате создания
Пагинация


###Frontend
React
Vite
Bootstrap
Страница авторизации
Страница регистрации
Управление заявками
Поиск и фильтрация
Пагинация
Панель администратора
Валидация форм
Обработка ошибок


###Backend
Django
Django REST Framework
JWT-аутентификация
PostgreSQL
Django Filter
REST API
Валидация данных
Автоматические API-тесты


###Инфраструктура
Docker
Docker Compose
PostgreSQL 16
Python 3.12
Poetry


##Технологический стек
###Backend
Python 3.12
Django
Django REST Framework
djangorestframework-simplejwt
django-filter
PostgreSQL
Poetry


###Frontend
React
Vite
Bootstrap
JavaScript


###Infrastructure
Docker
Docker Compose


##Структура проекта
###request-manager/
│
├── core/
│   ├── settings.py
│   ├── urls.py
│   └── ...
│
├── requests_api/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── filters.py
│   ├── urls.py
│   └── tests.py
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── Dockerfile
├── docker-compose.yml
├── pyproject.toml
├── poetry.lock
├── .env
└── README.md


###Требования
Для запуска проекта необходимо установить:
Docker
Docker Compose
Node.js
npm
Poetry

###Переменные окружения
В корне проекта необходимо создать файл .env:

POSTGRES_DB=request_manager
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432


###Запуск Backend через Docker
Из корневой директории проекта:
docker compose up --build

###Backend будет доступен по адресу:

http://127.0.0.1:8000

###Для остановки контейнеров:
docker compose down


###Запуск Frontend
В отдельном терминале:
cd frontend
npm install
npm run dev

###Frontend будет доступен по адресу:
http://localhost:5173


##API

###Backend предоставляет REST API для авторизации, работы с пользователями и управления заявками.
Авторизация 
Регистрация
POST /api/auth/register/

Пример запроса:

{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}

###Авторизация
POST /api/auth/login/

Возвращает JWT access и refresh токены.

###Пользователи
Текущий пользователь
GET /api/auth/users/me/

Возвращает информацию о текущем авторизованном пользователе.

###Статистика пользователей
GET /api/auth/users/statistics/

###Заявки
Получение списка заявок
GET /api/auth/requests/

###Создание заявки
POST /api/auth/requests/

###Получение заявки
GET /api/auth/requests/{id}/

###Редактирование заявки
PATCH /api/auth/requests/{id}/

###Удаление заявки
DELETE /api/auth/requests/{id}/

###Изменение статуса заявки
PATCH /api/auth/requests/{id}/status/

Пример:

{
  "status": "in_progress"
}

##Поиск и фильтрация
###Поиск
Поиск выполняется по названию и описанию заявки:
/api/auth/requests/?search=server

###Фильтрация по статусу
/api/auth/requests/?status=pending

###Фильтрация по приоритету
/api/auth/requests/?priority=high

###Фильтрация по дате создания
/api/auth/requests/?created_date=2026-09-11

###Пагинация
/api/auth/requests/?page=2

###Параметры поиска, фильтрации и пагинации можно комбинировать.
Например:
/api/auth/requests/?search=server&priority=high&page=2

##Права доступа
###Обычный пользователь
Обычный пользователь может:
Создавать заявки
Просматривать свои заявки
Редактировать свои заявки
Удалять свои заявки
Изменять статус своих заявок

###Администратор
Администратор может:
Просматривать все заявки
Создавать заявки
Редактировать заявки
Удалять заявки
Изменять статусы заявок
Использовать панель администратора
Просматривать информацию о пользователях


##Валидация

###API выполняет валидацию данных перед сохранением.
###Проверяются, в частности:

Уникальность username
Уникальность email
Длина пароля
Длина названия заявки
Длина описания заявки
Допустимость статуса заявки
Допустимость приоритета заявки


##Тестирование

###Backend-тесты можно запустить внутри Docker-контейнера:
docker compose exec web poetry run python manage.py test

###Тесты проверяют:
Создание заявки
Владение заявкой
Доступ администратора
Обновление заявки
Изменение статуса заявки
Валидацию неправильного статуса
Фильтрацию заявок

##Docker
###Проект использует Docker Compose и состоит из двух основных сервисов.

###Web

Django + Django REST Framework приложение.

###Database
PostgreSQL 16.
Запуск:

docker compose up --build

Остановка:

docker compose down


###Git Workflow

Для разработки используется отдельная ветка:


Разработка выполняется в ветке development.

После завершения разработки, тестирования и финальной проверки изменения объединяются с веткой main.

main
  ↑
development

# Request Manager

A full-stack request management system built with Django REST Framework and React.

The application allows users to create and manage requests, while administrators can manage all requests and users through a dedicated administration panel.

---

# English

## Features

### Authentication & Users

- User registration
- JWT authentication
- Access and refresh tokens
- Current user information
- User roles:
  - Regular user
  - Administrator

### Request Management

- Create requests
- View requests
- Update requests
- Delete requests
- Change request status
- Request ownership
- Administrators can manage all requests
- Regular users can manage only their own requests

### Search, Filtering & Pagination

- Search by title and description
- Filter by status
- Filter by priority
- Filter by creation date
- Pagination

### Frontend

- React
- Vite
- Bootstrap
- Login page
- Registration page
- Request management interface
- Search and filtering
- Pagination
- Administrator panel
- Form validation
- Error handling

### Backend

- Django
- Django REST Framework
- JWT authentication
- PostgreSQL
- Django Filter
- REST API
- Request validation
- Automated API tests

### Infrastructure

- Docker
- Docker Compose
- PostgreSQL 16
- Python 3.12
- Poetry

---

## Tech Stack

### Backend

- Python 3.12
- Django
- Django REST Framework
- djangorestframework-simplejwt
- django-filter
- PostgreSQL
- Poetry

### Frontend

- React
- Vite
- Bootstrap
- JavaScript

### Infrastructure

- Docker
- Docker Compose

---

## Project Structure

```text
request-manager/
│
├── core/
│   ├── settings.py
│   ├── urls.py
│   └── ...
│
├── requests_api/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── filters.py
│   ├── urls.py
│   └── tests.py
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── Dockerfile
├── docker-compose.yml
├── pyproject.toml
├── poetry.lock
├── .env
└── README.md