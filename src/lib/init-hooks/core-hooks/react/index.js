
const Layout = require('./Layout');

module.exports = function(BoringInjections) {

  const {
    boring
  } = BoringInjections;

  boring.react = {
    Layout
  }

  return {name: 'react'}
}