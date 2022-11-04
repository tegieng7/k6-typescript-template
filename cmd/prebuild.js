const fs = require('fs');
const glob = require('glob');
const yaml = require('js-yaml');
const yargs = require('yargs');

const { exec } = require('child_process');
const { relative, resolve } = require('path');

const DIR_ROOT = resolve(__dirname, '..');

const DIR_TEST = resolve(DIR_ROOT, 'src/test');
const DIR_TEST_CAMPAIGN = resolve(DIR_TEST, 'campaign');
const DIR_TEST_DATA = resolve(DIR_TEST, 'data');
const DIR_TEST_ENV = resolve(DIR_TEST, 'env');
const DIR_TEST_SCENARIO = resolve(DIR_TEST, 'scenario');
const DIR_TEST_SUITE = resolve(DIR_TEST, 'suite');

const DIR_SERVICE = resolve(DIR_ROOT, 'src/service')

const DIR_EXEC = resolve(DIR_ROOT, 'src/exec');
const FILE_EXEC_TESTCONFIG = resolve(DIR_EXEC, 'testconfig.ts');
const FILE_EXEC_TESTSUITE = resolve(DIR_EXEC, 'testsuite.ts');

const DIR_PROTO = resolve(DIR_ROOT, 'src/proto');

const argv = yargs
  .scriptName('prepare')
  .command(
    'campaign <name>',
    'Prepare to build campaign',
    yargs => {
      yargs.positional('name', {
        type: 'string',
        describe: 'Campaign name',
      });
    },
    function (argv) {
      prebuildCampaign(argv.name);
    }
  )
  .command(
    'test [<opt> <arg>]',
    'Prepare to build test',
    yargs => {
      yargs.option('scenario', {
        type: 'string',
        describe: 'Scenario',
      });
      yargs.option('env', {
        type: 'string',
        describe: 'Environment',
      });
      yargs.option('data', {
        type: 'string',
        describe: 'Data',
      });
    },
    function (argv) {
      prebuildConfig(argv);
    }
  )
  .help().argv;

function prebuildCampaign(campaignName) {
  const filepath = resolve(DIR_TEST_CAMPAIGN, campaignName);
  const config = yaml2json(filepath);
  prebuildConfig(config);
}

function prebuildConfig(argv) {
  // generate testconfig.js
  genTestConfig(argv.env, argv.data, argv.scenario);

  // generate testsuite.js
  genTestSuite();
}

function genTestConfig(env, data, scenario) {
  const fileTestEnv = resolve(DIR_TEST_ENV, env);
  const fileTestData = resolve(DIR_TEST_DATA, data);
  const fileTestScenario = resolve(DIR_TEST_SCENARIO, scenario);
  const content = `
    export const DIR_ROOT = "${DIR_ROOT}"

    export const DIR_TEST = "${DIR_TEST}"
    export const DIR_TEST_CAMPAIGN = "${DIR_TEST_CAMPAIGN}"
    export const DIR_TEST_DATA = "${DIR_TEST_DATA}"
    export const DIR_TEST_ENV = "${DIR_TEST_ENV}"

    export const DIR_SERVICE = "${DIR_SERVICE}"

    export const TEST_DATA_FILES: { [key: string]: string } = ${JSON.stringify(yaml2json(fileTestData))}

    export const TEST_ENV:any = ${JSON.stringify(yaml2json(fileTestEnv))}
    
    export const TEST_OPTION:any = ${JSON.stringify(yaml2json(fileTestScenario))}
  `;

  write2File(FILE_EXEC_TESTCONFIG, content);
}

function genTestSuite() {
  const dirTestSuite = resolve(DIR_TEST_SUITE);
  const ext = '.ts';

  var listLine = [];

  glob.sync(dirTestSuite + `/**/*${ext}`).forEach(function (filepath) {
    const filename = relative(DIR_TEST, filepath);
    const line = `export * from '${filename.replace(ext, '')}'`;
    listLine.push(line);
  });

  const content = listLine.join('\n');
  write2File(FILE_EXEC_TESTSUITE, content);
}

function write2File(filepath, content) {
  // write to file
  fs.writeFile(filepath, content, err => {
    if (err) {
      console.error(err);
    }
  });

  // format file
  exec(`yarn prettier ${filepath} --write`, (err, stdout, stderr) => {});
}

function yaml2json(filepath, excludeKeys = ['metadata']) {
  var doc = yaml.load(fs.readFileSync(filepath, 'utf8'));
  Object.keys(doc).forEach(key => {
    if (excludeKeys.includes(key)) {
      delete doc[key];
    }
  });
  return doc;
}
