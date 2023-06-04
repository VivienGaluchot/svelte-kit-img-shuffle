#!/bin/bash

SCRIPT_DIR=$(dirname "$0")
(
    cd $SCRIPT_DIR
    docker-compose up -d --build --remove-orphans
)