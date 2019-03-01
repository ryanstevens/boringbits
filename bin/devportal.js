const childProcess = require('child_process');

async function runDevPortal(argv) {

  childProcess.spawnSync('npm', ['run', 'linkDevportal'],
    {
      stdio: [process.stdin, process.stdout, process.stderr],
      cwd: __dirname + '/..',
    }
  );

  const args = [
    'boring',
    'start',
  ].concat(process.argv.slice(3));

  console.log('starting dev portal');
  return childProcess.spawnSync('npx', args,
    {
      stdio: [process.stdin, process.stdout, process.stderr],
      cwd: __dirname + '/../devportal',
      env: {
        ...process.env,
        NODE_ENV: 'production',
        skip_bundle_analyzer: true,
        boring_app_port: 5003,
      },
    }
  );

}

module.exports = function(argv) {
  try {
    return runDevPortal(argv);
  } catch (e) {
    console.error('There was a problem running jest', e);
    return Promise.reject({status: 1});
  }
};
