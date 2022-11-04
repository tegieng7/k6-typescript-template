import { group, check } from 'k6';
import grpc from 'k6/net/grpc';

/* @ts-ignore */
import { describe, expect } from 'jslib/k6chaijs';

import { serviceSayHello } from 'service/k6io/hello';
import { getRandomData } from 'lib/testdata';

// Data names
const DN = {
  name: 'name',
};

/**
 * Testcase to check hello service
 */
export function tc_sayHello() {
  const firstName = getRandomData(DN.name).firstName;
  const response = serviceSayHello(firstName);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const data: any = response.message;

  // use default group and check to verify the response
  group('Service hello (use default group and check)', function () {
    check(response, {
      'response status is OK': r => r && r.status === grpc.StatusOK,
    });
    check(data, {
      'response message started with hello': d => d.reply === 'hello ' + firstName,
    });
  });

  // use chai describe and expect from chaijs to verify the response
  describe('Service hello (use chaijs)', () => {
    expect(response.status, 'response status').to.equal(grpc.StatusOK);
    expect(data.reply === `hello ${firstName}`, 'response message started with hello').to.be.true;
  });
}
