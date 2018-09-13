const logger = require('boring-logger');
const paths = require('paths');

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

module.exports = function getStaticInjections(boring) {


  return function addInjections(req, res, next) {
    
    let { js, css } = (res.locals.webpackStats) ? assetsByDevserver(res.locals.webpackStats) : assetsByManifest();
    res.locals.js_injections = js.map(js => {
      return `\n<script src="${js}"></script>`;
    });
    res.locals.css_injections = css.map(css => {
      return `\n<link rel="stylesheet" href="="${js}"></link>`;
    });
    
    next();
  }

}