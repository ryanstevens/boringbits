const logger = require('boring-logger');
const paths = require('paths');
const pathitize = require('./pathitize');

let manifestAssets;

function assetsByManifest() {
  if (manifestAssets) return manifestAssets;
  const manifestPath = paths.asset_manifest;
  const manifest = require(manifestPath);
  logger.info(manifest, `Manifest loaded from path ${manifestPath}`);

  const js = Object.keys(manifest).reduce((collector, name) => {
    const assets = [].concat(manifest[name]).filter(asset => asset.endsWith('.js'));
    if (assets.length === 0) return collector;
    if (manifest['runtime.js']) {
      assets.unshift(manifest['runtime.js']);
    }
    collector[name.split('.').shift()] = assets;
    return collector;
  }, {});

  const css = Object.keys(manifest).reduce((collector, name) => {
    const assets = [].concat(manifest[name]).filter(asset => asset.endsWith('.css'));
    if (assets.length === 0) return collector;
    collector[name.split('.').shift()] = assets;
    return collector;
  }, {});

  manifestAssets = {
    js,
    css,
  };

  return manifestAssets;
}

function assetsByDevserver(webpackStats) {
  const chunks = webpackStats.toJson().assetsByChunkName;

  const js = Object.keys(chunks).reduce((collector, name) => {
    const assets = chunks[name].filter(chunk => chunk.endsWith('.js'));
    if (assets.length === 0) return collector;
    if (chunks.runtime) {
      assets.unshift([].concat(chunks.runtime).filter(asset => asset.endsWith('.js')));
    }
    collector[name.split('.').shift()] = assets;
    return collector;
  }, {});

  const css = Object.keys(chunks).reduce((collector, name) => {
    const assets = chunks[name].filter(chunk => chunk.endsWith('.css'));
    if (assets.length === 0) return collector;
    collector[name.split('.').shift()] = assets;
    return collector;
  }, {});

  return {
    js,
    css,
  };
}

module.exports = function getStaticInjections(res, entrypoint) {
  const assets = (res.locals.webpackStats) ? assetsByDevserver(res.locals.webpackStats) : assetsByManifest();
  const assetKey = pathitize(entrypoint);

  const jsFiles = assets.js[assetKey] || [];
  const cssFiles = assets.css[assetKey] || [];

  if (!res.locals.pageInjections) {
    res.locals.pageInjections = {
      bodyEndScripts: [],
      headLinks: [],
      headScripts: [],
    };
  } else if (!res.locals.pageInjections.bodyEndScripts) {
    res.locals.pageInjections.bodyEndScripts = [];
  } else if (!res.locals.pageInjections.headLinks) {
    res.locals.pageInjections.headLinks = [];
  } else if (!res.locals.pageInjections.headScripts) {
    res.locals.pageInjections.headScripts = [];
  }

  res.locals.pageInjections.bodyEndScripts = res.locals.pageInjections.bodyEndScripts.concat(jsFiles.map((asset) => {
    if (asset[0] !== '/') asset = `/${asset}`;
    return {
      src: asset,
    };
  }));

  res.locals.pageInjections.headLinks = res.locals.pageInjections.headLinks.concat(cssFiles.map((asset) => {
    if (asset[0] !== '/') asset = `/${asset}`;
    return {
      rel: 'stylesheet',
      href: asset,
    };
  }));
};
