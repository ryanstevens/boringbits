const injecture = require('injecture');
const logger = require('boring-logger');
require(process.cwd() + '/dist/server/app');

const servers = injecture.allInstances('BoringServer');

if (servers.length !== 1) {
  logger.error('Did not find only one boring server, instead found ' + servers.length);
  return;
}

module.exports = servers[0].app;
