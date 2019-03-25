const injecture = require('injecture');
const logger = require('boring-logger');
const fs = require('fs');

const appServer = process.cwd() + '/dist/server/app';

require(fs.existsSync(appServer) ? appServer : __dirname + '/defaultAppStart');

const servers = injecture.allInstances('BoringServer');

if (servers.length !== 1) {
  logger.error('Did not find only one boring server, instead found ' + servers.length);
} else {
  module.exports = servers[0].app;
};
