const childProcess = require('child_process');

async function test() {

  const args = [
    'jest',
    `--config=${__dirname}/../jest.config.js`,
  ];

  return childProcess.spawnSync('npx', args,
    {
      stdio: [process.stdin, process.stdout, process.stderr],
      cwd: process.cwd(),
    }
  );

}

module.exports = function(argv) {
  try {
    return test();
  } catch (e) {
    console.error('There was a problem running jest', e);
    return Promise.reject({status: 1});
  }
};
