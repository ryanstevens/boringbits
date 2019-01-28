'use strict';

const app = require('./startServer');
const awsServerlessExpress = require('aws-serverless-express');

const binaryMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);

module.exports = function getLambda() {
  return {
    serveBoringApp: function serveBoringApp(event, context) {
      awsServerlessExpress.proxy(
        server,
        event,
        context
      );
    },
  };
};

