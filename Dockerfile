# Use the official Deno image from the Docker Hub
FROM denoland/deno:latest

# Set the working directory to /app
WORKDIR /app

# Copy the local package files to the container's workspace.
ADD . /app

# Run the application
CMD ["deno", "run", "--allow-all", "--allow-env", "--unstable", "--watch", "./app.js"]