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

  const defaultComponents = {
    mainApp: 'defaultRootAppProxy',
    appTheme: 'defaultRootAppThemeProxy',
    appDecorator: 'defaultRootAppDecoratorProxy',
    reducers: 'defaultReducersProxy',
    Router: 'defaultRouterProxy',
  };

  Object.keys(defaultComponents).forEach(key => {
    if (!fs.existsSync(options.app_dir +'/'+ reactHandlerPaths[key])) {
      reactHandlerPaths[key] = __dirname + `/${defaultComponents[key]}.js`;
    }
    reactHandlerPaths.modulesToRequire[key] = reactHandlerPaths[key];
  });

  const entryPointPath = options.app_dir +'/'+reactHandlerPaths.entrypoint;

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
