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

  if (!processList.length) {
    process.stdout.write(`Port ${port} is available.\n`);
    return;
  }

  // send kill signal
  while (processList.length) {
    const p = processList.shift();
    if (!p) continue;
    const msg = `The process ${p.name}(${p.pid}) have been killed. ${
      p.cmd ? '(' + p.cmd + ')' : ''
    }\n`;
    try {
      process.kill(p.pid, 'SIGKILL');
      process.stdout.write(msg);
    } catch (err) {
      if (process.platform === 'win32') {
        await spawnAsync('taskkill', ['/pid', p.pid, '/f']);
        process.stdout.write(msg);
      } else {
        await spawnAsync('kill', ['-p', p.pid]);
      }
    }
  }
}

module.exports = killPort;
