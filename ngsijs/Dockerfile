# Use an official node.js runtime as a parent image (alpine helps reducing the image overall size)
FROM node:16-alpine as builder

# Set the working directory to /app 
WORKDIR /app

# Copy both package.json and package.lock.json files to the container
COPY package*.json .

# Install project dependencies
RUN npm install --silent

# Copy the rest of the server code to the container
COPY . .

# Run the server
CMD [ "node", "index.js"]