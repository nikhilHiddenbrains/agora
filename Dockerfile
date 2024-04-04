# Use the official Node.js image as the base image
FROM node:16 as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install --legacy-peer-deps

# Copy the entire project to the container
COPY . .

# Build the Angular app for production
RUN npm run build

# Use a smaller, production-ready image as the final image
FROM nginx:alpine

# Copy nginx file
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Set the working directory in the container
WORKDIR /usr/share/nginx/html

# Copy the production-ready Angular app to the Nginx webserver's root directory
COPY --from=build /app/dist/apps/web-app .

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]