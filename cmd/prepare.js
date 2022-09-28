const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const yargs = require('yargs');

// Command line arguments
const argv = yargs
  .command('data', 'Test data')
  .command('env', 'Test environment')
  .command('event', 'Test event')
  .command('runner', 'Test runner')
  .command('suite', 'Test suite')
  .help()
  .alias('help', 'h').argv;

const DIR_ROOT = path.resolve(__dirname, '..');

const DIR_TEST_DATA = path.resolve(DIR_ROOT, 'src/test/data');
const DIR_TEST_ENV = path.resolve(DIR_ROOT, 'src/test/env');
const DIR_TEST_EVENT = path.resolve(DIR_ROOT, 'src/test/event');
const DIR_TEST_RUNNER = path.resolve(DIR_ROOT, 'src/test/runner');
const DIR_TEST_SUITE = path.resolve(DIR_ROOT, 'src/test/suite');

const DIR_PROTO = path.resolve(DIR_ROOT, 'src/proto');

const FILES = parseParas();
const FILE_TEST_DATA = path.resolve(DIR_TEST_DATA, String(FILES.data));
const FILE_TEST_ENV = path.resolve(DIR_TEST_ENV, String(FILES.env));
const FILE_TEST_RUNNER = path.resolve(DIR_TEST_RUNNER, String(FILES.runner));
const FILE_TEST_SUITE = path.resolve(DIR_TEST_SUITE, String(FILES.suite));

const FILE_JS_TESTCONFIG = path.resolve(DIR_ROOT, 'src/exec/testconfig.ts');
const FILE_JS_PATH = path.resolve(DIR_ROOT, 'src/exec/path.ts');
const FILE_JS_TESTSUITE = path.resolve(DIR_ROOT, 'src/exec/testsuite.ts');

function parseParas() {
  var files = argv;
  if (argv.event) {
    const eventFilePath = path.resolve(DIR_TEST_EVENT, String(argv.event));
    files = yaml2json(eventFilePath);
  }

  return files;
}

function yaml2json(filepath, excludeKeys = ['metadata']) {
  // Get document, or throw exception on error
  try {
    var doc = yaml.load(fs.readFileSync(filepath, 'utf8'));
    Object.keys(doc).forEach(key => {
      if (excludeKeys.includes(key)) {
        delete doc[key];
      }
    });
    return doc;
  } catch (e) {
    return {};
  }
}

function genJsPath(filepath) {
  const content = `
    export const DIR_ROOT = "${DIR_ROOT}"

    export const DIR_TEST_DATA = "${DIR_TEST_DATA}"
    export const DIR_TEST_ENV = "${DIR_TEST_ENV}"
    export const DIR_TEST_RUNNER = "${DIR_TEST_RUNNER}"
    export const DIR_TEST_SUITE = "${DIR_TEST_SUITE}"
    
    export const DIR_PROTO = "${DIR_PROTO}"
  `;

  fs.writeFile(filepath, content, err => {
    if (err) {
      console.error(err);
    }
  });
}

function genJsTestConfig(filepath) {
  const content = `
    export const TEST_DATA_FILES: { [key: string]: string } = ${JSON.stringify(yaml2json(FILE_TEST_DATA))}

    export const TEST_ENV:any = ${JSON.stringify(yaml2json(FILE_TEST_ENV))}
    
    export const TEST_RUNNER:any = ${JSON.stringify(yaml2json(FILE_TEST_RUNNER))}
  `;
  fs.writeFile(filepath, content, err => {
    if (err) {
      console.error(err);
    }
  });
}

function genJsTestSuite(filepath) {
  const doc = yaml2json(FILE_TEST_SUITE);

  var listFile = [];
  Object.keys(doc).forEach(filename => {
    filename = filename.replace('.ts', '')
    const line = `export * from 'suite/${filename}'`;
    listFile.push(line);
  });

  fs.writeFile(filepath, listFile.join('\n'), err => {
    if (err) {
      console.error(err);
    }
  });
}

function main() {
  // generate src/exec/path.js
  genJsPath(FILE_JS_PATH);

  // generate src/exec/testconfig.js
  genJsTestConfig(FILE_JS_TESTCONFIG);

  // generate src/exec/testsuite.js
  genJsTestSuite(FILE_JS_TESTSUITE);
}

if (require.main === module) {
  main();
}
