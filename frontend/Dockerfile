# frontend/Dockerfile.dev
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# # frontend/Dockerfile
# # 1) build stage
# FROM node:18-alpine as build-stage
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build

# # 2) production nginx stage
# FROM nginx:1.25-alpine
# RUN rm -rf /usr/share/nginx/html/*
# COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

