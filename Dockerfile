# Base Python image with slim size
FROM python:3.11-slim

# Install ffmpeg and Node.js dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg git curl build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js (v18)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Set working directory
WORKDIR /app

# Copy all project files
COPY . .

# Install Python packages
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Install Node.js dependencies
RUN npm install

# Expose port for server
EXPOSE 5001

# Start Node.js backend
CMD ["node", "server.js"]
