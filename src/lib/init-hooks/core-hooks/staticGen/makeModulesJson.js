

module.exports = {
  createJson: (files, prefix) => {

    if (!prefix) {
      prefix = process.cwd() + '/node_modules/';
    }

    const cache = {};
    files.forEach(file => {
      const parts = file.split(prefix);
      if (parts.length === 2) {
        const moduleName = parts[1].split('/').shift();
        if (!cache[moduleName]) {
          cache[moduleName] = [];
        }
        cache[moduleName].push(file);
      }
    });

    let total = 0;
    const orderedCache = {};
    Object.keys(cache).sort().forEach(key => {
      total += cache[key].length;
      orderedCache[key] = cache[key].sort();
    });

    return {
      modulesCount: Object.keys(cache).length,
      totalRequiredFiles: total,
      modules: orderedCache,
    };

  },
};

