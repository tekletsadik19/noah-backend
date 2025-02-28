# Build stage
FROM node:18-alpine AS builder

# Add necessary build tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.*.* ./
COPY .prettierrc ./
COPY .eslintrc.json ./

# Install dependencies with legacy-peer-deps to handle NX dependency issues
RUN npm ci --legacy-peer-deps

# Copy source code
COPY apps/auth-microservice ./apps/auth-microservice
COPY shared ./shared

# Build the application
RUN npx nx build auth-microservice

# Production stage
FROM node:18-alpine

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only production dependencies and build artifacts
COPY --from=builder /app/dist/apps/auth-microservice ./
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production --legacy-peer-deps

# Set proper permissions
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

EXPOSE 3001
CMD ["node", "main.js"] 