"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getEntryWrappers;

var fs = _interopRequireWildcard(require("fs"));

var babel = _interopRequireWildcard(require("@babel/core"));

var _boringLogger = _interopRequireDefault(require("boring-logger"));

var _beforeEntryLoader = _interopRequireDefault(require("./beforeEntryLoader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function makeConainerCode({
  path,
  importPath
} = container) {
  // const name = path.replace(/\//g, '');

  /*
  // TODO: I had to backpedal a bit on
  // making these routez lazy loaded via
  // webpacks optimization chunks.
  // Should be too hard to renable,
  // was just having some trouble keeping
  // hot reload working which is more of a
  // priority
  const ${name}_container = Loadable({
    loader: () => imporzzt('${importPath}'),
    loading: function Loading() {
      return <></>;
    },
  });
  */
  return `
    containers.push({
      path: '${path}',
      container: require('${importPath}').default
    })
  `;
}

function makeModuleCode(modules) {
  return Object.keys(modules).map(moduleName => {
    return `
      modules['${moduleName}'] = require('${modules[moduleName]}').default;
    `;
  }).join('\n');
}

function getEntryWrappers(reactHandlerPaths, modules = {}) {
  const containers = reactHandlerPaths.containers.filter(container => container.path).sort((containerA, containerB) => {
    /**
     * This is a reverse sort on the path, the
     * goal here is so paths that are more specific
     * end up rendering first and the "default"
     * path, which is typically the shortest
     * will be at the bottom.  For now
     * this seems to work but I assume someone
     * will tell me a use case and we'll have to
     * rework this
     */
    if (containerA.path.length < containerB.path.length) return 1;
    if (containerA.path.length > containerB.path.length) return -1;
    return 0;
  });
  if (containers.legnth === 0) return [];
  const prefix = __dirname + '/dist';
  const beforeFilename = reactHandlerPaths.reactRoot + '_beforeEntry.js';
  const beforeEntryFilePath = prefix + '/' + beforeFilename;
  const afterFilename = reactHandlerPaths.reactRoot + '_afterEntry.js';
  const afterEntryFilePath = prefix + '/' + afterFilename;
  const code = `
    // THIS IS A GENERATED FILE, PLEASE DO NOT MODIFY
    const containers = [];
    const modules = [];
  ` + containers.map(makeConainerCode).join('\n') + makeModuleCode(modules) + _beforeEntryLoader.default.toString() + '\nbeforeEntryLoader();';
  const babelOptions = {
    'babelrc': false,
    'sourceMaps': true,
    'presets': [['@babel/preset-env', {
      'targets': {
        'ie': '11'
      }
    }], '@babel/preset-react'],
    'plugins': ['@babel/plugin-proposal-object-rest-spread', ['@babel/plugin-proposal-decorators', {
      legacy: true
    }], ['@babel/plugin-syntax-dynamic-import']]
  };
  const babelResults = babel.transformSync(code, babelOptions);
  let writeNewBefore = true;

  if (fs.existsSync(beforeEntryFilePath)) {
    if (fs.readFileSync(beforeEntryFilePath) == babelResults.code) {
      writeNewBefore = false;

      _boringLogger.default.debug(`The fle ${beforeEntryFilePath} has already been generated, nothing has changed`);
    }
  }

  if (writeNewBefore) {
    _boringLogger.default.debug(`The fle ${beforeEntryFilePath} is being generated, please do not change it's contents`);

    fs.writeFileSync(beforeEntryFilePath, babelResults.code);
    fs.writeFileSync(beforeEntryFilePath + '.map', JSON.stringify(babelResults.map));
  }

  fs.writeFileSync(afterEntryFilePath, `//afterEntry hook`);
  return [beforeEntryFilePath, afterEntryFilePath];
}

;
//# sourceMappingURL=index.js.map