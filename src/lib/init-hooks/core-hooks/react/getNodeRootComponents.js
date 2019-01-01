import {getNamespace} from 'boring-cls';

module.exports = function get() {
  const ns = getNamespace('http-request');
  const reactHandlerPaths = ns.get('reactHandlerPaths');
  return {
    ...reactHandlerPaths,
  };
};
