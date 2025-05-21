FROM node:18-alpine

# Install canvas and other dependencies to load the project 
RUN apk add --no-cache \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    python3 \
    curl

WORKDIR /app


COPY package*.json ./

RUN npm install


COPY . .

# Use the port from .env (5000)
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:5001/health || exit 1
RUN npm install -g nodemon

# Start the server
CMD ["nodemon", "server.js"]