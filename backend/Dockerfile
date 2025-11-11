# backend/Dockerfile
FROM node:18-alpine

# set working directory
WORKDIR /usr/src/app

# install system deps (if needed)
RUN apk add --no-cache bash

# copy package.json and package-lock.json first to leverage docker cache
COPY package*.json ./

# install dependencies
RUN npm ci --production

# copy app source
COPY . .

# expose port your app listens on (example 5000)
EXPOSE 5000

# healthcheck (optional)
# HEALTHCHECK --interval=30s --timeout=3s \
#   CMD curl -f http://localhost:5000/health || exit 1

# run the server (use npm start or node)
CMD ["npm", "start"]
