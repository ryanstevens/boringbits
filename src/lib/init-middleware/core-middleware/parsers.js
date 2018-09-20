const serveStatic = require('serve-static')
const path = require('path');
const compose = require('compose-middleware').compose

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


module.exports = function boringInection(boring) {

  boring.before('init-routers', function() {
    boring.app.use(boring.middleware.parsers)
  })

  return compose([
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
    cookieParser()
  ])
};