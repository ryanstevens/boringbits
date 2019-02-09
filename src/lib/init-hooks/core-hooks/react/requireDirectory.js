import logger from 'boring-logger';
import fs from 'fs-extra';
import {normalize} from 'path';

export default function requireDirectory(appDir, directoryPath) {
  const dirToRead = (appDir) ? appDir +'/'+ directoryPath : directoryPath;
  try {
    if (!fs.existsSync(dirToRead)) return [];
    return fs.readdirSync(dirToRead).map(function(file) {
      if (file.endsWith('.map')) return null;
      const fileParts = file.split('.');
      if (fileParts.length > 1) fileParts.pop();
      const moduleName = fileParts.join('.'); // don't worry about what type of extension
      const mod = require(normalize(dirToRead + '/' + moduleName));
      return {
        moduleName,
        module: (mod.default) ? mod.default : mod,
        importPath: directoryPath + '/' + moduleName,
      };
    }).filter(Boolean);

  } catch (e) {
    logger.error(e, 'Problem requiring directory');
    return [];
  }
}
