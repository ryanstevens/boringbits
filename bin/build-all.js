const childProcess = require('child_process');
const fs = require('fs');

async function runCmds(cmds) {
  if (cmds.length === 0) return Promise.resolve();
  const cmd = cmds.shift();
  const result = childProcess.spawnSync('npx', ['boringbits', cmd], {
    stdio: [process.stdin, process.stdout, process.stderr],
    cwd: process.cwd(),
  });

  if (result.status > 0) {
    return Promise.reject({
      cmd,
      ...result,
    });
  } else return runCmds(cmds);
}

async function getGitCommitHash() {
  try {
    const results = childProcess.spawnSync('git', ['rev-parse', 'HEAD'], {
      cwd: process.cwd(),
    });

    return results.output.toString().split(',')[1].substring(0, 7);
  } catch (e) {
    return 'unknown';
  }
}

module.exports = async function(args) {
  try {

    await runCmds(['build-node', 'build-client', 'build-static']);

    fs.writeFileSync(process.cwd() + '/build/build-stats.json', JSON.stringify({
      build: {
        hash: await getGitCommitHash(),
        time: (new Date()),
      },
    }, null, 4));

    return Promise.resolve();

  } catch (e) {
    console.error('There was a problem the boring command', e);
    return Promise.reject();
  }
};
