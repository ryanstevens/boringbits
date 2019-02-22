
module.exports = {
  testMatch: ['**/*-test.js'],
  transform: {
    '\\.(ts|tsx|js|jsx)$': __dirname + '/jestBabelTransform',
  },
  moduleNameMapper: {
    '^db(.*)$': process.cwd() + '/src/db$1',
    '^client(.*)$': process.cwd() + '/src/client$1',
    '^modules(.*)$': process.cwd() + '/src/modules$1',
    '^server(.*)$': process.cwd() + '/src/server$1',
  },
  roots: [
    process.cwd() + '/src',
  ],
};
