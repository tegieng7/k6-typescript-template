#!/usr/bin/env bash

# Init husky
yarn husky install

# Generate src/exec/path.ts src/exec/testconfig.ts
mkdir -p src/exec
node cmd/prepare.js --event demo/hello.yaml
yarn prettier src/exec/path.ts --write
yarn prettier src/exec/testconfig.ts --write
yarn prettier src/exec/testsuite.ts --write
