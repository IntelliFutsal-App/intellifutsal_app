FROM node:18-alpine

# Install psql client for health checks / scripts
RUN apk add --no-cache postgresql-client bash

WORKDIR /usr/src/app

# Copy only package files first for faster rebuilds
COPY package*.json ./
RUN npm ci

# Copy app source
COPY . .

# Make migrations runner executable (ya lo llevas)
COPY run-migrations.sh /run-migrations.sh
RUN chmod +x /run-migrations.sh

# Expose the port your app listens on
EXPOSE 3000

# Entrypoint will wait for DB and run migrations, then exec the CMD
ENTRYPOINT ["/run-migrations.sh"]

# By default start the app in dev mode via nodemon (you can change to `npm start`)
CMD ["npm", "run", "dev"]