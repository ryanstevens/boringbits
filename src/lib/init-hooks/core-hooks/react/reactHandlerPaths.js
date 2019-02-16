import config from 'boring-config';
import paths from 'paths';
import fs from 'fs-extra';


export default function getPaths(options = {}) {

  const reactRoot = options.reactRoot;

  // this needs to live outside of the spread
  // because it is used to create baseAppPath
  const clientRoot = options.clientRoot || config.get('boring.react.clientRoot', 'client/pages');

  options = {
    ...paths,
    clientRoot,
    baseAppPath: clientRoot + '/' + reactRoot,
    entrypointFile: config.get('boring.react.entrypoint', 'entrypoint'),
    routeContainersDirectory: config.get('boring.react.routerContainersDirectory', 'containers'),
    decoratorDirectory: config.get('boring.react.decoratorDirectory', 'decorators'),
    // not quite sure if we are gonna require this for people.
    mainAppFile: config.get('boring.react.mainApp', 'App.js'),
    appThemeFile: config.get('boring.react.appTheme', 'AppTheme.js'),
    appDecoratorFile: config.get('boring.react.appDecorator', 'AppDecorator.js'),
    routerFile: config.get('boring.react.router', 'Router.js'),
    reducersFile: config.get('boring.react.reducers', 'reducers'),
    ...options,
  };

  const reactHandlerPaths = {
    // This grouping are filepaths
    // relative to the application
    // meant to be required / imported.
    // These are the `defaults` for borings
    // react / redux conventions
    entrypoint: options.baseAppPath + '/' + options.entrypointFile,
    mainApp: options.baseAppPath + '/'+ options.mainAppFile,
    appTheme: options.baseAppPath + '/'+ options.appThemeFile,
    appDecorator: options.baseAppPath + '/'+ options.appDecoratorFile,
    Router: options.baseAppPath + '/'+ options.routerFile,
    reducers: options.baseAppPath + '/'+ options.reducersFile,
    // this one is a little special, we want to
    // make sure it's relative to the app_dir
    // but not having the app_dir in it's path
    routerContainersPath: options.baseAppPath + '/' + options.routeContainersDirectory,
    decoratorsPath: options.baseAppPath + '/' + options.decoratorDirectory,

    decorators: {},
    containers: {},
    ...options,
  };

  reactHandlerPaths.modulesToRequire = {};
  const entryPointPath = options.app_dir +'/'+reactHandlerPaths.entrypoint;

  if (!fs.existsSync(options.app_dir +'/'+ reactHandlerPaths.mainApp)) {
    reactHandlerPaths.mainApp = __dirname + '/defaultRootAppProxy.js';
  }
  reactHandlerPaths.modulesToRequire.mainApp = reactHandlerPaths.mainApp;

  if (!fs.existsSync(options.app_dir +'/'+ reactHandlerPaths.appTheme)) {
    reactHandlerPaths.appTheme = __dirname + '/defaultRootAppThemeProxy.js';
  }
  reactHandlerPaths.modulesToRequire.appTheme = reactHandlerPaths.appTheme;

  if (!fs.existsSync(options.app_dir +'/'+ reactHandlerPaths.appDecorator)) {
    reactHandlerPaths.appDecorator = __dirname + '/defaultRootAppDecoratorProxy.js';
  }
  reactHandlerPaths.modulesToRequire.appDecorator = reactHandlerPaths.appDecorator;

  if (!fs.existsSync(options.app_dir +'/'+ reactHandlerPaths.reducers)) {
    reactHandlerPaths.reducers = __dirname + '/defaultReducersProxy.js';
  }
  reactHandlerPaths.modulesToRequire.reducers = reactHandlerPaths.reducers;

  if (!fs.existsSync(options.app_dir +'/'+ reactHandlerPaths.Router)) {
    reactHandlerPaths.Router = __dirname + '/defaultRouterProxy.js';
  }
  reactHandlerPaths.modulesToRequire.Router = reactHandlerPaths.Router;

  // check to make sure entrypoint is real
  if (!fs.existsSync(entryPointPath + '.js') &&
    !fs.existsSync(entryPointPath + '.jsx') &&
    !fs.existsSync(entryPointPath + '.ts') &&
    !fs.existsSync(entryPointPath + '.tsx')) {
    reactHandlerPaths.entrypoint = {
      canonicalPath: reactRoot,
      assetPath: __dirname + '/defaultEntrypointProxy.js',
    };
  }

  return reactHandlerPaths;
};
