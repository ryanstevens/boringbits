
import paths from 'paths';
import requireInject from 'require-inject-all';
import * as baseDecorators from '../decorators';

// eslint-disable-next-line valid-jsdoc
module.exports = async function initDecorators(BoringInjections) {

  const decoratorDirs = BoringInjections.plugins.splicePlugins('decorators', [paths.boring_decorators, paths.server_decorators]);
  const decorators = await requireInject(decoratorDirs, BoringInjections, baseDecorators);

  return Object.keys(decorators).reduce(function(prev, key) {
    const decoratorExport = decorators[key];
    let name = key;

    if (decoratorExport && decoratorExport.name) {
      name = decoratorExport.name;
    }

    prev[name] = decoratorExport || {};
    return prev;
  }, baseDecorators);

};
