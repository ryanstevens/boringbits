
module.exports = function setupRoute(/* dependencies from boring */ boring) {

  const {
    logger,
    config,
    decorators,
  } = boring;

  const {
    router,
    post,
    get,
    entrypoint,
  } = decorators.router;

  // signals to boring this class has HTTP decortors as class methods
  @router()
  class <%= className %> {

    @post('<%= path %>data.json')
    serve_<%= pageName %>_data(req, res) {
      logger.info('Severing JSON for <%= pageName %>');
      res.json({
        msg: 'hello world, good to meet you ' + req.body.name
      });
    }

    @get('<%= path %>')
    @entrypoint('client/pages/<%= pageName %>/entrypoint.js')
    serve_<%= pageName %>_get(req, res) {
      logger.info('Severing HTML for <%= pageName %>');

      const links = res.locals.pageInjections.headLinks || [];
      const scripts = res.locals.pageInjections.bodyEndScripts || [];

      res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          ${links.map(link => `<link rel="stylesheet" href="${link.href}" />`).join('\n')}
        </head>
        <body>
          <div id="root"></div>
          ${scripts.map(script => `<script src="${script.src}"></script>`).join('\n')}
        </body>
      </html>
      `)
    }
  }

};
