# Use an official Node.js runtime as the base image
FROM node:20

ARG ENV

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Copy the application source code to the working directory
COPY . .

# Install application dependencies
RUN npm install