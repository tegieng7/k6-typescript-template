#!/usr/bin/env bash

# prepare environment to build
node cmd/prebuild.js $@

# generate bundle file 
yarn build

# run k6 
k6 run dist/main.js
