
module.exports = function setupRoute(/* dependencies from boring */ boring) {

  const {
    logger,
    config,
    decorators,
  } = boring;

  const {
    endpoint,
    post,
    get,
    entrypoint,
  } = decorators.router;

  // signals to boring this class has HTTP decortors as class methods
  @endpoint()
  class <%= className %> {

    // The @get decorator is the primary mechanism to setup a route in boring
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
      logger.info('Severing JSON for <%= pageName %>');


      const links = res.locals.pageInjections.headLinks || [];
      const scripts = res.locals.pageInjections.bodyEndScripts || [];

      res.send(`
    <!DOCTYPE html>
      <html style={{ height: '100%' }}>
        <head>
          ${links.map(link => {
            return `<link rel="stylesheet" href="${link.href}" />`;
          }).join('\n')}
        </head>
        <body style={{ height: '100%', padding: '0px', margin: '0px' }}>
          <div style={{ width: '100%', height: '100%' }} id="root">

          </div>
          ${scripts.map(script => {
            return `<script src="${script.src}"></script>`;
          }).join('\n')}
        </body>
      </html>
      `)
    }
  }

};
