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

  @router('/__boring')
  class DemoRouter {

    @post('/data.json')
    serve_demo_data(req, res) {
      logger.info('Severing JSON for demo, artificially delaying response 1500 ms');
      setTimeout(() => {
        res.json({
          msg: 'hello world, ' + req.body.greeting,
          color: 'green',
        });
      }, 1500);
    }

    @get('*')
    @reactEntry('demo')
    serve_demo_get(req, res) {
      res.renderRedux({
        components: {
          preloadedState: {
            message: {
              msg: 'Message set by the server',
              color: 'orange',
            }
          }
        }
      });
    }
  }

};
