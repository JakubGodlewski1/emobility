FROM node:20-alpine3.20 AS build-stage
WORKDIR /src
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine3.20
WORKDIR /src
COPY package*.json .
RUN npm install --only=production
COPY --from=build-stage ./src/dist ./dist
COPY --from=build-stage ./src/dbMigrations ./dbMigrations

EXPOSE 3000
CMD ["npm", "run", "start"]