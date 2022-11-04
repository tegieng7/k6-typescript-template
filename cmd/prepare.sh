#!/usr/bin/env bash

# init husky
yarn husky install

# prebuild demo
mkdir -p src/exec
node cmd/prebuild.js campaign k6io/demo.yaml
