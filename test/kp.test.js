import test from 'ava';
import killPort from '../index';
const spawn = require('cross-spawn');

const port = process.env.KP_TEST_PORT;

test('kill process which listen on a port', async t => {
  console.info(`current process id: ${process.pid}`);
  await killPort(port);
  t.pass();
});
