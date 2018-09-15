const logger = require('boring-logger');
const paths = require('paths');
const pathitize = require('./pathitize');

let manifestAssets, devAssets;
function assetsByManifest() {

  if (manifestAssets) return manifestAssets;
  const manifestPath = paths.asset_manifest;
  const manifest = require(manifestPath);
  logger.info(manifest, 'Manifest loaded from path ' + manifestPath);

  manifestAssets = Object.keys(manifest).reduce((collector, name) => {
    let assets = [].concat(manifest[name]).filter(asset => asset.endsWith('.js'));
    if (assets.length === 0) return collector;

    collector[name.split('.').shift()] = assets;
    return collector;
  }, {});
  return manifestAssets;
}

function assetsByDevserver(webpackStats) {
//  if (devAssets) return devAssets; // no need to cache cause localhost 
  const chunks = webpackStats.toJson().assetsByChunkName;
  
  devAssets = Object.keys(chunks).reduce((collector, name) => {
    const chunk = chunks[name];
    const assets = chunk.filter(chunk => chunk.endsWith('.js'));
    if (assets.length === 0) return collector;
    collector[name.split('.').shift()] = assets;
    return collector;
  }, {})

  return devAssets;
}

module.exports = function getStaticInjections(res, entrypoint) {
  const assets = (res.locals.webpackStats) ? assetsByDevserver(res.locals.webpackStats) : assetsByManifest();

  const js = assets[pathitize(entrypoint)] || [];

  const css = []; // this will have to be implemented at some point
  res.locals.js_injections = js.map(js => {
    return `\n<script src="${js}"></script>`;
  });
  res.locals.css_injections = css.map(css => {
    return `\n<link rel="stylesheet" href="="${js}"></link>`;
  });

}