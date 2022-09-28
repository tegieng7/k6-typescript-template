# Template to use TypeScript with k6

This repository provides a template project to start using TypeScript in your k6 scripts:

- Seperate test case, test data, test environment, test runner
- Pre-commit check style and format

## Prerequisites

- [k6](https://k6.io/docs/getting-started/installation)
- [NodeJS](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/getting-started/install)

## Installation

**Install dependencies**

Clone the generated repository on your local machine, move to the project root folder and install the dependencies defined

```bash
$ yarn install
```

## Running the demo test

Run the demo

```bash
$ yarn k6:demo
```

Run demo with config file

```bash
$ yarn k6 --event demo/hello.yaml
```

Run demo with options: test env, test suite, test data, test runner

```bash
$ yarn k6 --env demo/k6io.yaml --suite demo/hello.yaml --data demo/hello.data.yaml --runner demo/hello.yaml
```

## Writing own tests

**Directory structure**

**_`src/test/suite`_**

**_`src/test/data`_**

**_`src/test/env`_**

**_`src/test/runner`_**

**_`src/test/event`_**
