
module.exports = function(BoringInjections) {
  
  const compose = require('compose-middleware').compose
  const boring = BoringInjections.boring;
  const {
    paths,
    logger,
    config
  } = boring;

  let webpackDevMiddleware, HMR;

  if (config.get('use_webpack_dev_server', false)) {
      
    const webpack = require('webpack')
    const webpack_config = require(paths.boring_webpack_dev_config);
    const compiler = webpack(webpack_config)

    
    webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
      serverSideRender: true, 
      publicPath: '/' 
    });

    HMR = require('webpack-hot-middleware')(compiler);
  }

  let manifestAssets, devAssets;
  function assetsByManifest() {

    if (manifestAssets) return manifestAssets;
    const manifestPath = paths.asset_manifest;
    const manifest = require(manifestPath);
    logger.info(manifest, 'Manifest loaded from path ' + manifestPath);

    manifestAssets = {
      js: [manifest['main.js']],
      css: [manifest['main.css']]
    }

    return manifestAssets;
  }

  function assetsByDevserver(webpackStats) {
    if (devAssets) return devAssets;
    const chunks = webpackStats.toJson().assetsByChunkName;
    const js = [];
    const css = [];

    chunks.main.forEach(chunk => {
      if (chunk.endsWith('.js')) js.push('/'+chunk);
      else if (chunk.endsWith('.css')) css.push('/'+chunk);
    });
    devAssets = { js, css };
    return devAssets;
  }

  function addInjections(req, res, next) {
    
    let { js, css } = (res.locals.webpackStats) ? assetsByDevserver(res.locals.webpackStats) : assetsByManifest();
    res.locals.js_injections = js.map(js => {
      return `\n<script src="${js}"></script>`;
    });
    res.locals.css_injections = css.map(css => {
      return `\n<link rel="stylesheet" href="="${js}"></link>`;
    });
    
    next();
  }
  
  boring.after('init-hooks', function() {
    boring.app.use(function(req, res, next) {
      // this is for HMR for localhost
      if (config.get('use_webpack_dev_server', false)) {
  
        const devMiddleware = compose([
          webpackDevMiddleware, 
          HMR,
          addInjections
        ])
        
        devMiddleware(req, res, next)
        
      } addInjections(req, res, next);
    });
  });
  

  return {name: 'boring-webpack'}
}