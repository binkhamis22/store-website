FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install
RUN cd backend && npm install && npm rebuild sqlite3

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start the application
WORKDIR /app/backend
CMD ["node", "databaseServer.js"] 