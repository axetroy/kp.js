const spawn = require('cross-spawn');
const find = require('find-process');

async function spawnAsync(command, argv = [], options = {}) {
  const stream = spawn(
    command,
    argv,
    Object.assign(
      { env: process.env, cwd: process.cwd(), stdio: 'inherit' },
      options
    )
  );
  return await new Promise((resolve, reject) => {
    stream.on('close', (code, signal) => {
      code === 0
        ? resolve()
        : reject(
            `<${command + ' ' + argv.join(' ')}> Error Code: ${
              code
            }, Exist Signal: ${signal}`
          );
    });
  });
}

async function killPort(port) {
  const processList = await find('port', port);
  const processLength = processList.length;

  if (!processLength) {
    console.info(`Port ${port} is available.`);
    return;
  }

  // send kill signal
  while (processLength) {
    const p = processList.shift();
    const msg = `The process ${p.pid} have been killed. (${p.name})\n`;
    try {
      process.kill(p.pid, 'SIGKILL');
      process.stdout.write(msg);
    } catch (err) {
      if (process.platform === 'win32') {
        await spawnAsync('taskkill', ['/pid', p.pid, '/f']);
        process.stdout.write(msg);
      }
    }
  }
}

module.exports = killPort;
