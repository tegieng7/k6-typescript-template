import { group, check } from 'k6';

import { serviceSayHello } from 'service/demo/hello';
import { getRandomData } from 'lib/testdata';

// Data names
const DN = {
  name: 'name',
};

export function tc_sayHello() {
  const firstName = getRandomData(DN.name).firstName;
  const response = serviceSayHello(firstName);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const data: any = response.message;

  group('Service hello', function () {
    check(data, {
      'reply message is correct': d => d.reply === 'hello ' + firstName,
    });
  });
}
