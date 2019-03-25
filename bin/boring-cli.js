#!/usr/bin/env node
let ran = false;

function makeCmd(mod) {
  return function exec(argv) {
    ran = true;
    require('./' + mod)(argv)
      .then((result = {status: 0}) => {
        process.exit(result.status);
      })
      .catch(e => {
        console.log(`

Problem with boring command ${mod}

`, e || '');
        process.exit(1);
      });
  };
}
console.log(process.argv.join(' '));
if (process.argv.join(' ').toLowerCase().indexOf('who named boring')>=0) {
  require('ryan_stevens');
}

require('yargs')
  .usage('$0 <cmd> [cmd-args]')
  .command('start', 'Run your boring application', makeCmd('start'))
  .command('debug', 'Debug your boring application', makeCmd('debug'))
  .command('jest', 'run jest to test', makeCmd('jest'))
  .command('jest-debug', 'run jest to test with --inspect-brk', makeCmd('jest-debug'))
  .command('type-check', 'Runs tsc against your projects TypeScript', makeCmd('boring-tsc'))
  .command('tsc', '(Alias for type-check)', makeCmd('boring-tsc'))
  .command('dev-portal', 'A UI for your UI development', makeCmd('devportal'))

  .command('build-client', 'Run webpack on your project\'s web client', makeCmd('build-client'))
  .command('build-node', 'Babel (ES7 + TypeScript) on your project\'s server', makeCmd('build-node'))
  .command('build-static', 'Generate static site', makeCmd('build-static'))
  .command('build', 'Runs build-node, build-client, build-static', makeCmd('build-all'))
  .command('deploy', 'Start a deploy to aws lambda', makeCmd('deploy'))
  .command('run-lambda', 'Runs a local docker container to simulate an aws lambda', makeCmd('run-lambda'))
  .command('build-deploy', 'Runs build-node, build-client, build-static, then deploys', makeCmd('build-deploy'))
  .command('up', 'Run `docker-compose up` to launch infrastructure such as reverse proxy', makeCmd('docker-compose-up'))
  .command('down', 'Run `docker-compose down` to tear down infrastructure', makeCmd('docker-compose-down'))
  .command('yo', 'Generate routes / views / app structure', makeCmd('yo'))
  .command('generate', 'Alias to `yo`', makeCmd('yo'))
  .demandCommand(1)
  .help()
  .argv;

if (!ran) {
  console.log('No valid <cmd> given, please run `boring help` for a list of commands');
}
