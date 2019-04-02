import isNode from 'detect-node';

function getRootComponents() {
  const rootPath = '../../../lib/init-hooks/core-hooks/react/getNodeRootComponents'; // this simply ensures the node side isn't webpacked bundled
  return require(rootPath)();
}

export default function loadComponents() {
  let components = {};
  if (isNode) {
    components = getRootComponents();
  } else {
    components = window.__boring_internals;
  }

  return {
    containers: components.containers,
    decorators: components.decorators,
    context: components.context,
    ...components.modules,
  };
}
