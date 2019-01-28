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
        console.error('!!!!!!   Did not find only one boring server, instead found ' + servers.length);
        return;
      }

      const app = servers[0].app;
      awsServerlessExpress.proxy(
        awsServerlessExpress.createServer(app, null, binaryMimeTypes),
        event,
        context
      );
    },
  };
};

