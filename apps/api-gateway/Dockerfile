FROM node:20-alpine AS builder

# Add necessary build tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files first
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.*.* ./
COPY .prettierrc ./
COPY .eslintrc.json ./

# Install dependencies with legacy-peer-deps flag
RUN npm install --legacy-peer-deps

# Copy source code
COPY apps/api-gateway ./apps/api-gateway
COPY shared ./shared

# Build the application
RUN npx nx build api-gateway

# Production stage
FROM node:20-alpine

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only production dependencies and build artifacts
COPY --from=builder /app/dist/apps/api-gateway ./
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production --legacy-peer-deps

# Set proper permissions
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000
CMD ["node", "main.js"] 