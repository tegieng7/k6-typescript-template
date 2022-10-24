export * from 'exec/testsuite';

import { Options } from 'k6/options';

import { textSummary } from 'jslib/k6-summary';

import { TEST_RUNNER } from 'exec/testconfig';

export const options: Options = TEST_RUNNER;

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Handle summary
 *
 * @param data result summary
 */
export function handleSummary(data: any) {
  return {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
