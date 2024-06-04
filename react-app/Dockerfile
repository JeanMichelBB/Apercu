# Use the official Node.js image as the base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve the React app
FROM nginx:1.21

# Copy the build output from the previous stage into the Nginx server
COPY --from=0 /app/build /usr/share/nginx/html

# Copy the Nginx configuration file
COPY default.conf /etc/nginx/conf.d/default.conf

# Pass environment variables (if needed)
ARG REACT_APP_API_URL
ARG REACT_APP_API_KEY
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_API_KEY=$REACT_APP_API_KEY

# Expose port 80 to the outside world
EXPOSE 3001

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

