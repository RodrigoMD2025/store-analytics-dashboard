# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code into the container
COPY backend/ .

# The $PORT environment variable is provided by Railway. Gunicorn will use it.
# We don't need to explicitly EXPOSE it as Railway handles this.

# Define the command to run the application
CMD gunicorn api.index:app --bind 0.0.0.0:$PORT
