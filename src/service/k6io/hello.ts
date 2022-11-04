import grpc from 'k6/net/grpc';
import { resolve } from 'path';

import { DIR_SERVICE, TEST_ENV } from 'exec/testconfig';

const DIR_PROTO = resolve(DIR_SERVICE, 'k6io/proto');

const client = new grpc.Client();
client.load([DIR_PROTO], 'hello.proto');

const address = TEST_ENV.address;

/**
 * Sevice SayHello
 *
 * @param name first name
 */
export function serviceSayHello(name: string) {
  client.connect(address, {
    // plaintext: false
  });

  const data = { greeting: name };
  const response = client.invoke('hello.HelloService/SayHello', data);

  client.close();

  return response;
}
