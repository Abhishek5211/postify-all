# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy source code
COPY . .

# Stage 2: Production
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Create a non-root user
RUN addgroup -g 10001 -S appgroup && adduser -u 10001 -S appuser -G appgroup

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

# Set environment variables
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Switch to non-root user
USER 10001

# Start the server
CMD ["npm", "start"]

