# Stage 1: Build app with Node.js 22
FROM node:22-bullseye AS build
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files and build
COPY . .
RUN npm run build -- --output-path=dist

# Stage 2: Serve app with nginx
FROM nginx:bullseye
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Expose port 4200 for Angular app
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
