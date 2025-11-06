# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code into the container
COPY backend/ .

# Print all environment variables and then run the bot
CMD ["sh", "-c", "echo '--- Printing Environment Variables ---' && env && echo '--- Starting Bot ---' && python bot.py"]