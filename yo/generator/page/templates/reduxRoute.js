module.exports = function setupRoute(/* dependencies from boring */ boring) {

  const {
    logger,
    config,
    decorators,
  } = boring;

  const {
    router,
    get,
    post,
    reactEntry,
  } = decorators.router;

  @router()
  class <%= className %>Router {

    @post('<%= path %>/data.json')
    serve_<%= pageName %>_data(req, res) {
      logger.info('Severing JSON for <%= pageName %>, artificially delaying response 1500 ms');
      setTimeout(() => {
        res.json({
          msg: 'hello world, ' + req.body.greeting
        });
      }, 1500);
    }

    @get('<%= path %>*')
    @reactEntry('<%= pageName %>')
    serve_<%= pageName %>_get(req, res) {
      res.renderRedux();
    }
  }

};
