# Use an official Node.js image as the base image
FROM node:20.10-alpine

# Install bash, sed and check if yarn is already installed before installing
RUN apk update && apk add bash sed && \
    if ! command -v yarn > /dev/null; then \
      npm install -g yarn; \
    fi

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies using yarn
RUN yarn install

# Copy the rest of the application code into the container
COPY . .

# Make sure the build.sh script is executable
RUN chmod +x build.sh

# Run the build.sh script to install ESLint and Next.js dependencies, then build pacman.js
RUN ./build.sh

# Build the application (assuming it's a Next.js project)
RUN npm run build

# Expose the port the app will run on (Next.js typically runs on port 3000)
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]

