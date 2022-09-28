#!/usr/bin/env bash

# generate src/exec/path.ts src/exec/testconfig.ts
node cmd/prepare.js $@
yarn prettier src/exec/path.ts --write
yarn prettier src/exec/testconfig.ts --write
yarn prettier src/exec/testsuite.ts --write

# generate bundle file 
yarn build

# run k6 
k6 run dist/main.js
