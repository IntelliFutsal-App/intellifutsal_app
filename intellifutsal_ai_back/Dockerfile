FROM python:3.9-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_RUN_HOST=0.0.0.0

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir gunicorn python-dotenv

# Create static dir (if not in the repo)
RUN mkdir -p /static/models

COPY . .

EXPOSE 9041

CMD ["gunicorn", "--bind", "0.0.0.0:9041", "--timeout", "90", "main:app"]