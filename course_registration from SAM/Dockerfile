# Use an official Node.js image as the base
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 1000

# Set environment variables (optional if using .env in Docker Compose)
ENV PORT=1000

# Start the app
CMD ["node", "app.js"]
