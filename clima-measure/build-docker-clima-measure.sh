#!/bin/bash
VERSION="0.5.7"
ARCH="arm32v7"
APP="clima-measure"
docker buildx build -f ./Dockerfile-$APP-$ARCH -t $APP:$VERSION . --load
docker tag $APP:$VERSION pkalkman/$APP:$VERSION
docker push pkalkman/$APP:$VERSION