# Dockerfile for a Node.js application
FROM node:18-alpine

# Download PostgreSQL client
RUN apk add --no-cache postgresql-client

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Copy and make the migration script executable
COPY run-migrations.sh /run-migrations.sh
RUN chmod +x /run-migrations.sh

# Build the application (if applicable)
EXPOSE 3000

# Use run-migrations.sh as the entrypoint
ENTRYPOINT ["/run-migrations.sh"]

# Start the application
CMD ["npm", "start"]