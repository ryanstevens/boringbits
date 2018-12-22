module.exports = function setupRoute(/* dependencies from boring */ boring) {

  const {
    logger,
    config,
    decorators,
  } = boring;

  const {
    endpoint,
    get,
    post,
    reactEntry,
  } = decorators.router;

  @endpoint()
  class <%= className %>Router {

    @post('<%= path %>data.json')
    serve_<%= pageName %>_data(req, res) {
      logger.info('Severing JSON for <%= pageName %>');
      res.json({
        msg: 'hello world, good to meet you ' + req.body.name
      });
    }

    @get('<%= path %>')
    @reactEntry('<%= pageName %>')
    serve_<%= pageName %>_get(req, res) {
      res.renderRedux();
    }
  }

};
