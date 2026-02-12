# Use official Python 3.9 slim image as base
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_RUN_HOST=0.0.0.0

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install gunicorn and python-dotenv if not in requirements.txt
RUN pip install --no-cache-dir gunicorn python-dotenv

# Create static directory for models
RUN mkdir -p /static/models

# Copy application files
COPY . .

# Expose Flask port
EXPOSE 5000

# Run the app using Gunicorn with main.py as the entry point
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--timeout", "90", "main:app"]