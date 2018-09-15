const serveStatic = require('serve-static')
const path = require('path');

module.exports = function boringInection(boring) {

  boring.after('init-routers', function() {
    boring.app.use(boring.middleware.static)
  })

  return serveStatic(path.join(process.cwd(), 'build'), {
    redirect: false,
    index: false,
    dotfiles: 'ignore',
    etag: false
  });
};