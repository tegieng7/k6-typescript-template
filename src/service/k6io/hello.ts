import grpc from 'k6/net/grpc';

import { DIR_PROTO } from 'exec/path';
import { TEST_ENV } from 'exec/testconfig';

const client = new grpc.Client();
client.load([DIR_PROTO], 'k6io/hello.proto');

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
