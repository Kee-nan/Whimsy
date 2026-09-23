FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN mkdir -p uploads/profile-pictures uploads/tag-icons
EXPOSE 5000
CMD ["node", "server.js"]
