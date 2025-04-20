# Step 1: Use official Node.js base image
FROM node:18

# Step 2: Create app directory
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the rest of the application code
COPY . .

# Step 5: Expose the port your app runs on
EXPOSE 5005

# Step 6: Start the application
CMD ["node", "src/index.js"]

