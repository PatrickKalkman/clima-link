#!/bin/bash
VERSION="0.5.6"
ARCH="arm32v7"
APP="clima-storage"
docker buildx build -f ./Dockerfile-$APP-$ARCH -t $APP:$VERSION . --load
docker tag $APP:$VERSION pkalkman/$APP:$VERSION
docker push pkalkman/$APP:$VERSION