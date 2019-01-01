
import * as fs from 'fs';
import babel from 'babelCompiler';
import logger from 'boring-logger';
import beforeEntryLoader from './beforeEntryLoader';

function makeConainerCode({module, moduleName, importPath} = container) {

  return `
  (function() {

    const loadableModule = Loadable({
      loader: () => import('${importPath}'),
      loading: function Loading() {
        return null;
      },
    });
    loadableModule.path = '${module.path}';
    loadableModule.importPath = '${importPath}';

    containers['${moduleName}'] = loadableModule;

  })();

  `;
}

function mapModules(modules) {

  return Object.keys(modules).map(moduleName => {
    return `
      (function requireModule() {
        const requiredMod = require('${modules[moduleName]}');
        modules['${moduleName}'] =  (requiredMod.default) ? requiredMod.default : requiredMod;
      })();
    `;
  }).join('\n');
}


function mapDecorators(decorators) {

  return decorators.map(decorator => {
    return `
      (function requireDecorator() {
        const requiredMod = require('${decorator.importPath}');
        decorators['${decorator.moduleName}'] =  (requiredMod.default) ? requiredMod.default : requiredMod;
      })();
    `;
  }).join('\n');
}

export default function getEntryWrappers(reactRoot, containers = [], modules = {}, decorators = []) {


  const prefix = __dirname + '/dist';
  const beforeFilename = reactRoot + '_beforeEntry.js';

  const beforeEntryFilePath = prefix + '/' + beforeFilename;

  const afterFilename = reactRoot + '_afterEntry.js';
  const afterEntryFilePath = prefix + '/' + afterFilename;

  const generatedCode = mapDecorators(decorators)
                        + containers.map(makeConainerCode).join('\n')
                        + mapModules(modules);

  const code = beforeEntryLoader
    .toString()
    .replace( 'GENERATED_CODE', '\n' + generatedCode)
    + ';beforeEntryLoader();';

  const babelResults = babel(code);

  let writeNewBefore = true;
  if (fs.existsSync(beforeEntryFilePath)) {
    if (fs.readFileSync(beforeEntryFilePath) == babelResults.code) {
      writeNewBefore = false;
      logger.debug(`The fle ${beforeEntryFilePath} has already been generated, nothing has changed`);
    }
  }

  if (writeNewBefore) {
    logger.debug(`The fle ${beforeEntryFilePath} is being generated, please do not change it's contents`);
    fs.writeFileSync(beforeEntryFilePath, babelResults.code);
    fs.writeFileSync(beforeEntryFilePath+'.map', JSON.stringify(babelResults.map));
  }

  fs.writeFileSync(afterEntryFilePath, `//afterEntry hook`);


  return [beforeEntryFilePath, afterEntryFilePath];
};
