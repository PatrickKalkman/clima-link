#!/bin/bash
(cd clima-measure; ./build-docker-clima-measure.sh)
(cd clima-broker; ./build-docker-clima-broker.sh)
(cd clima-storage; ./build-docker-clima-storage.sh)

