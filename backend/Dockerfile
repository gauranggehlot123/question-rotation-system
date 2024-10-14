# Use the official MongoDB image as the base image
FROM mongo:latest

# Expose the default MongoDB port
EXPOSE 27017

# Set the data directory
ENV MONGO_DATA_DIR /data/db

# Create the data directory and set permissions
RUN mkdir -p $MONGO_DATA_DIR && \
    chown -R mongodb:mongodb $MONGO_DATA_DIR

# Set the command to run MongoDB
CMD ["mongod", "--bind_ip_all", "start:debug"]