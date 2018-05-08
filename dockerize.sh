#!/bin/bash
if [ "$1" == "-r" ]; then
  echo Rebuilding and restarting
  echo Remember to prune unused volumes with: docker volume prune -f
  docker stop les
  docker rm les
fi

if [[ $(docker ps -q -a -f name=les) = "" ]]; then
  echo No LES container found, building and running
  docker rmi eca/les
  docker build -t eca/les .
  docker run --name les -d -it -p 8000:8000 \
    --mount type=bind,source="$(pwd)",target=/usr/src/app \
    eca/les
else
  echo Starting container
  docker restart les
fi

echo ---------------------------- Running Docker Containers ----------------------------
docker ps
