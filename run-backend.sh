#!/bin/bash

# This script is used to run the backend in a docker container
# It will remove the docker container and image if they already exist
# It will then build the docker image and run the docker container


DOCKER_IMAGE_NAME=ev-reg-back

DOCKER_CONTAINER=$(sudo docker ps -a | awk '$2 == "ev-reg-back" {print $1}')
DOCKER_IMG=$(sudo docker images | awk '$1 == "ev-reg-back" {print $3}')

# Remove docker container if it exists
if [[ "$DOCKER_CONTAINER" != "" ]];
then
    echo "Docker container $DOCKER_CONTAINER already exists, removing it"
    sudo docker rm -f $DOCKER_CONTAINER
    echo "Docker container removed"
else
    echo "Docker container does not exist"
fi

# Remove docker image if it exists
if [[ "$DOCKER_IMG" != "" ]];
then
    echo "Docker image $DOCKER_IMG already exists, removing it"
    sudo docker rmi $DOCKER_IMG
    echo "Docker image removed"
else
    echo "Docker image does not exist"
fi

# Build docker image
echo "Building docker image"
sudo docker build -t ev-reg-back .
echo "Docker image built"

# Run docker-compose to run the backend
echo "Starting the backend with docker-compose"
sudo docker-compose up

exit 0
