import decorators from '../../../decorators';
import Emitter from 'eventemitter2';
import logger from 'boring-logger';
import config from 'boring-config';
import {writeFile, mkdirp} from 'fs-extra';
import {get} from 'request';
import {promisify} from 'util';
import paths from 'paths';
import {normalize} from 'path';
import {writeFileSync} from 'fs';
import {createJson} from './makeModulesJson';

const emitter = new Emitter({wildcard: true});
const request = promisify(get);
const write = promisify(writeFile);
const mkdir = promisify(mkdirp);

async function savePage(port, path) {
  const url = `http://localhost:${port}${path}`;
  const resp = await request(url);
  const dir = normalize(paths.proj_dir + '/build/' + path);
  const file = normalize(dir + '/index.html');
  await mkdir(dir);
  await write(file, resp.body);
  logger.info(`Wrote ${resp.body.length} bytes to ${file}`);
  return;
}


module.exports = function reactHook(BoringInjections) {

  const {
    boring,
  } = BoringInjections;

  decorators.router.createEndpointDecorator('staticGen');

  const staticPromises = [];
  emitter.on('decorator.router.staticGen', function(decoratorContext) {
    const arg = decoratorContext.staticGen.shift();
    staticPromises.push((arg instanceof Promise) ? Promise.resolve(arg): arg);
  });

  decorators.router.subscribeDecorators(emitter);

  if (config.get('boring.build.staticgen')) {
    boring.after('listen', async function() {

      const routePaths = await Promise.all(staticPromises);

      await Promise.all(
        routePaths.reduce((acc, pathObj) => acc.concat(pathObj.paths), [])
          .map(savePage.bind(null, BoringInjections.port))
      );

      writeFileSync(process.cwd() + '/dist/required-modules.json',
        JSON.stringify(createJson(Object.keys(require.cache)), null, 2));

      process.exit(0);
    });
  }

  return {name: 'staticGen'};
};
