import grpc from 'k6/net/grpc';
import { check, group } from 'k6';

import { DIR_PROTO } from 'exec/path';
import { TEST_ENV } from 'exec/testconfig';

const client = new grpc.Client();
client.load([DIR_PROTO], 'k6io/hello.proto');

const address = TEST_ENV.address;

export function serviceSayHello(name: string) {
  client.connect(address, {
    // plaintext: false
  });

  const data = { greeting: name };
  const response = client.invoke('hello.HelloService/SayHello', data);

  group('Service hello', function () {
    check(response, {
      'status is OK': r => r && r.status === grpc.StatusOK,
    });
  });

  // console.log(JSON.stringify(response.message));

  client.close();

  return response;
}
