FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV POETRY_REQUESTS_TIMEOUT=120

WORKDIR /app

RUN pip install --no-cache-dir poetry

COPY pyproject.toml poetry.lock README.md ./

RUN poetry config virtualenvs.create false \
    && poetry config installer.max-workers 1 \
    && poetry install --no-interaction --no-ansi

COPY . .

EXPOSE 8000

CMD ["poetry", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]