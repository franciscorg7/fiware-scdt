# First stage
FROM node:16.14.2-alpine as builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm build

# Second stage
FROM nginx:1.19.0
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]