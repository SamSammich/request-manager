# Request Manager

# Русская версия

## О проекте

**Request Manager** — полнофункциональная система управления заявками, разработанная с использованием **Django REST Framework** и **React**.

Приложение позволяет пользователям создавать и управлять своими заявками, а администраторам — управлять всеми заявками и пользователями через отдельную административную панель.

---

## Возможности

### Авторизация и пользователи

- Регистрация пользователей
- JWT-аутентификация
- Access и refresh токены
- Получение информации о текущем пользователе
- Роли пользователей:
  - Обычный пользователь
  - Администратор

### Управление заявками

- Создание заявок
- Просмотр заявок
- Редактирование заявок
- Удаление заявок
- Изменение статуса заявки
- Привязка заявки к пользователю
- Администратор может управлять всеми заявками
- Обычный пользователь может управлять только своими заявками

### Поиск, фильтрация и пагинация

- Поиск по названию и описанию
- Фильтрация по статусу
- Фильтрация по приоритету
- Фильтрация по дате создания
- Пагинация

### Frontend

- React
- Vite
- Bootstrap
- Страница авторизации
- Страница регистрации
- Управление заявками
- Поиск и фильтрация
- Пагинация
- Панель администратора
- Валидация форм
- Обработка ошибок

### Backend

- Django
- Django REST Framework
- JWT-аутентификация
- PostgreSQL
- django-filter
- REST API
- Валидация данных
- Автоматические API-тесты

### Инфраструктура

- Docker
- Docker Compose
- PostgreSQL 16
- Python 3.12
- Poetry

---

## Технологический стек

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

## Структура проекта

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
```

---

## Требования

Для запуска проекта необходимо установить:

- Docker
- Docker Compose
- Node.js
- npm
- Poetry

---

## Переменные окружения

В корне проекта необходимо создать файл `.env`:

```env
POSTGRES_DB=request_manager
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

---

## Запуск Backend через Docker

Из корневой директории проекта:

```bash
docker compose up --build
```

Backend будет доступен по адресу:

```text
http://127.0.0.1:8000
```

Для остановки контейнеров:

```bash
docker compose down
```

---

## Запуск Frontend

В отдельном терминале:

```bash
cd frontend
npm install
npm run dev
```

Frontend будет доступен по адресу:

```text
http://localhost:5173
```

---

# API

Backend предоставляет REST API для авторизации, работы с пользователями и управления заявками.

## Авторизация

### Регистрация

```http
POST /api/auth/register/
```

Пример запроса:

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

### Авторизация

```http
POST /api/auth/login/
```

Возвращает JWT access и refresh токены.

---

## Пользователи

### Текущий пользователь

```http
GET /api/auth/users/me/
```

Возвращает информацию о текущем авторизованном пользователе.

### Статистика пользователей

```http
GET /api/auth/users/statistics/
```

---

## Заявки

### Получение списка заявок

```http
GET /api/auth/requests/
```

### Создание заявки

```http
POST /api/auth/requests/
```

### Получение заявки

```http
GET /api/auth/requests/{id}/
```

### Редактирование заявки

```http
PATCH /api/auth/requests/{id}/
```

### Удаление заявки

```http
DELETE /api/auth/requests/{id}/
```

### Изменение статуса заявки

```http
PATCH /api/auth/requests/{id}/status/
```

Пример запроса:

```json
{
  "status": "in_progress"
}
```

---

## Поиск и фильтрация

### Поиск

Поиск выполняется по названию и описанию заявки:

```text
/api/auth/requests/?search=server
```

### Фильтрация по статусу

```text
/api/auth/requests/?status=pending
```

### Фильтрация по приоритету

```text
/api/auth/requests/?priority=high
```

### Фильтрация по дате создания

```text
/api/auth/requests/?created_date=2026-09-11
```

### Пагинация

```text
/api/auth/requests/?page=2
```

Параметры поиска, фильтрации и пагинации можно комбинировать.

Пример:

```text
/api/auth/requests/?search=server&priority=high&page=2
```

---

## Права доступа

### Обычный пользователь

Обычный пользователь может:

- Создавать заявки
- Просматривать свои заявки
- Редактировать свои заявки
- Удалять свои заявки
- Изменять статус своих заявок

### Администратор

Администратор может:

- Просматривать все заявки
- Создавать заявки
- Редактировать заявки
- Удалять заявки
- Изменять статусы заявок
- Использовать панель администратора
- Просматривать информацию о пользователях

---

## Валидация

API выполняет валидацию данных перед сохранением.

Проверяются:

- Уникальность username
- Уникальность email
- Длина пароля
- Длина названия заявки
- Длина описания заявки
- Допустимость статуса заявки
- Допустимость приоритета заявки

---

## Тестирование

Backend-тесты можно запустить внутри Docker-контейнера:

```bash
docker compose exec web poetry run python manage.py test
```

Тесты проверяют:

- Создание заявки
- Владение заявкой
- Доступ администратора
- Обновление заявки
- Изменение статуса заявки
- Валидацию неправильного статуса
- Фильтрацию заявок

---

## Docker

Проект использует Docker Compose и состоит из двух основных сервисов.

### Web

Django + Django REST Framework приложение.

### Database

PostgreSQL 16.

Запуск:

```bash
docker compose up --build
```

Остановка:

```bash
docker compose down
```

---

## Git Workflow

Для разработки используется отдельная ветка:

```text
main
  ↑
development
```

Разработка выполняется в ветке `development`.

После завершения разработки, тестирования и финальной проверки изменения объединяются с веткой `main`.


A full-stack request management system built with **Django REST Framework** and **React**.

The application allows users to create and manage their requests, while administrators can manage all requests and users through a dedicated administration panel.

---

# English Version

## Project Overview

**Request Manager** is a full-stack request management application developed using **Django REST Framework** and **React**.

Users can create and manage their own requests, while administrators can manage all requests and users through a dedicated administration panel.

---

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
- Request management
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
- django-filter
- REST API
- Data validation
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
```

---

## Requirements

The following software is required to run the project:

- Docker
- Docker Compose
- Node.js
- npm
- Poetry

---

## Environment Variables

Create a `.env` file in the project root:

```env
POSTGRES_DB=request_manager
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

> **Important:** Do not commit the `.env` file to the Git repository.

---

## Running the Backend with Docker

From the project root:

```bash
docker compose up --build
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

To stop the containers:

```bash
docker compose down
```

---

## Running the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

# API

The backend provides a REST API for authentication, users, and request management.

## Authentication

### Register

```http
POST /api/auth/register/
```

Example request:

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

```http
POST /api/auth/login/
```

Returns JWT access and refresh tokens.

---

## Users

### Current User

```http
GET /api/auth/users/me/
```

Returns information about the currently authenticated user.

### User Statistics

```http
GET /api/auth/users/statistics/
```

---

## Requests

### List Requests

```http
GET /api/auth/requests/
```

### Create Request

```http
POST /api/auth/requests/
```

### Get Request

```http
GET /api/auth/requests/{id}/
```

### Update Request

```http
PATCH /api/auth/requests/{id}/
```

### Delete Request

```http
DELETE /api/auth/requests/{id}/
```

### Update Request Status

```http
PATCH /api/auth/requests/{id}/status/
```

Example request:

```json
{
  "status": "in_progress"
}
```

---

## Search & Filtering

### Search

Search requests by title or description:

```text
/api/auth/requests/?search=server
```

### Filter by Status

```text
/api/auth/requests/?status=pending
```

### Filter by Priority

```text
/api/auth/requests/?priority=high
```

### Filter by Creation Date

```text
/api/auth/requests/?created_date=2026-09-11
```

### Pagination

```text
/api/auth/requests/?page=2
```

Search, filtering, and pagination parameters can be combined.

Example:

```text
/api/auth/requests/?search=server&priority=high&page=2
```

---

## Permissions

### Regular User

A regular user can:

- Create requests
- View their own requests
- Update their own requests
- Delete their own requests
- Change the status of their own requests

### Administrator

An administrator can:

- View all requests
- Create requests
- Update requests
- Delete requests
- Change request statuses
- Access the administrator panel
- View user information

---

## Validation

The API validates incoming data before saving it.

Validation includes:

- Username uniqueness
- Email uniqueness
- Password length
- Request title length
- Request description length
- Valid request status
- Valid request priority

---

## Testing

Backend tests can be run inside the Docker container:

```bash
docker compose exec web poetry run python manage.py test
```

The test suite covers:

- Request creation
- Request ownership
- Administrator access
- Request updates
- Request status updates
- Invalid status validation
- Request filtering

---

## Docker

The project uses Docker Compose and consists of two main services.

### Web

Django + Django REST Framework application.

### Database

PostgreSQL 16 database.

Start the services:

```bash
docker compose up --build
```

Stop the services:

```bash
docker compose down
```

---

## Git Workflow

Development is performed on a separate branch:

```text
main
  ↑
development
```

The `development` branch is used for active development.

After development, testing, and final verification, changes are merged into the `main` branch.

---

