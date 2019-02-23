const childProcess = require('child_process');

async function test(argv) {

  const args = [
    '--inspect-brk',
    'node_modules/.bin/jest',
    `--config=${__dirname}/../jest.config.js`,
    '--runInBand',
  ].concat(process.argv.slice(3));

  console.log('npx ' + args.join(' '));

  return childProcess.spawnSync('node', args,
    {
      stdio: [process.stdin, process.stdout, process.stderr],
      cwd: process.cwd(),
    }
  );

}

module.exports = function(argv) {
  try {
    return test(argv);
  } catch (e) {
    console.error('There was a problem running jest', e);
    return Promise.reject({status: 1});
  }
};
