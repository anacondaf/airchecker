# Use an official Node.js runtime as a parent image
FROM node:alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install pm2
RUN npm install pm2 -g

# Install app dependencies
RUN npm ci

# Install make and other essential packages
RUN apt install build-essential -y --no-install-recommends

RUN make run-seeders

# Copy the rest of the app source code to the container
COPY . .

# Expose the port that the app listens on
EXPOSE 80

# Start the app by running the "npm start" command
CMD ["npm", "start"]
