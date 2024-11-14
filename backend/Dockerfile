# Use an official Node.js image as the base
FROM node:23-alpine

# Set the working directory
WORKDIR /build

# Copy the package.json and package-lock.json (if available) to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Define the command to run your app
CMD ["npm", "start"]
