'use strict';
const awsServerlessExpress = require('aws-serverless-express');
const injecture = require('injecture');

const binaryMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

module.exports = function getLambda() {
  return {
    serveBoringApp: function serveBoringApp(event, context) {

      require(process.cwd() + '/dist/server/app');

      const servers = injecture.allInstances('BoringServer');
      if (servers.length !== 1) {
        console.error('Did not find only one boring server');
        return;
      }

      awsServerlessExpress.proxy(
        awsServerlessExpress.createServer(servers.pop().app, null, binaryMimeTypes),
        event,
        context
      );
    },
  };
};

