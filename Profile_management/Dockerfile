# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port the app will run on
EXPOSE 4002

# Start the application
CMD ["node", "./src/index.js"]
