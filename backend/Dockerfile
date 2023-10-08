# Use an official Node.js runtime as a parent image
FROM node:alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm ci --only=production

# Copy the rest of the app source code to the container
COPY . .

# Expose the port that the app listens on
EXPOSE 80

# Start the app by running the "npm start" command
CMD ["npm", "start"]
