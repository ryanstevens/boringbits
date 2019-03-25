const childProcess = require('child_process');

async function docker(argv) {

  const argsStr = `run -e boring_express_noopListen:true -e NODE_ENV=production -v ${process.cwd()}/.boring/deploy:/var/task -it lambci/lambda:nodejs8.10 handler.serveBoringApp`;

  console.log('docker ' + argsStr);

  return childProcess.spawnSync('docker', argsStr.split(' '),
    {
      stdio: [process.stdin, process.stdout, process.stderr],
      cwd: process.cwd(),
    }
  );

}

module.exports = function(argv) {
  try {
    return docker(argv);
  } catch (e) {
    console.error('There was a problem running docker', e);
    return Promise.reject({status: 1});
  }
};
