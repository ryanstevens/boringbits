
require('@babel/register')({
  'presets': [
    ['@babel/preset-env', {
      'targets': {
        'node': '8',
      },
    }],
    ['@babel/preset-typescript'],
    '@babel/preset-react',
  ],
  'extensions': ['.jsx', '.js', '.tsx', '.ts'],
  'plugins': [
    '@babel/plugin-proposal-object-rest-spread',
    ['@babel/plugin-proposal-decorators', {
      legacy: true,
    }],
    ['@babel/plugin-proposal-class-properties'],
    ['@babel/plugin-syntax-dynamic-import'],
    ['react-loadable/babel'],
  ],
});
