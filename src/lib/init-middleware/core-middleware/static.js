const serveStatic = require('serve-static');
const path = require('path');

module.exports = function boringInection(boring) {

  boring.after('add-routers', function() {
    boring.app.use('static', boring.middleware.static);
  });

  return serveStatic(path.join(process.cwd(), 'build'), {
    redirect: false,
    cacheControl: true,
    dotfiles: 'ignore',
    etag: false,
  });
};
