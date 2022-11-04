import path from 'path';
import papaparse from 'jslib/papaparse';

import { SharedArray } from 'k6/data';

/* @ts-ignore */
import { randomItem } from 'jslib/k6-utils';

import { DIR_TEST_DATA, TEST_DATA_FILES } from 'exec/testconfig';

export const TEST_DATA = loadTestData();

/**
 * Get random data row of test data
 *
 * @param dataName name of test data
 */
export function getRandomData(dataName: string) {
  const data = TEST_DATA[dataName];
  return randomItem(data);
}

/**
 * Get test data by name
 *
 * @param dataName name of test data
 */
export function getData(dataName: string) {
  return TEST_DATA[dataName];
}

/**
 * Parse test data file
 *
 * @param filepath path to test data file under src/test/data directory
 */
function parseFile(filepath: string) {
  if (!path.isAbsolute(filepath)) {
    filepath = path.resolve(DIR_TEST_DATA, filepath);
  }

  let data = null;

  const extension = filepath.split('.').pop();
  switch (extension) {
    case 'csv': {
      data = papaparse.parse(open(filepath), { header: true }).data;
      break;
    }
    case 'json': {
      data = JSON.parse(open(filepath));
      break;
    }
    case 'yaml': {
      break;
    }
    default: {
      break;
    }
  }

  return data;
}

/**
 * Load test data from config
 *
 * @param testdataFiles {dataName: filepath, ...}
 */
function loadTestData(testdataFiles = TEST_DATA_FILES) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const testdata: any = {};

  for (const [name, filepath] of Object.entries(testdataFiles)) {
    const data = parseFile(filepath);
    if (Array.isArray(data)) {
      const shareArr = new SharedArray(name, () => data);
      testdata[name] = shareArr;
    } else {
      testdata[name] = data;
    }
  }

  return testdata;
}
