FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.*.* ./
COPY .prettierrc ./
COPY .eslintrc.json ./

# Copy the entire apps and shared directories
COPY apps/auth-microservice ./apps/auth-microservice
COPY shared ./shared

RUN npm ci
RUN npx nx build auth-microservice

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist/apps/auth-microservice ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3001
CMD ["node", "main.js"] 