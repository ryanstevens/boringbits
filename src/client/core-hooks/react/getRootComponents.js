import React from 'react';
import isNode from 'detect-node';
import defer from 'deferitize';

function getRootComponents() {
  const rootPath = '../../../lib/init-hooks/core-hooks/react/getNodeRootComponents'; // this simply ensures the node side isn't webpacked bundled
  return require(rootPath)();
}


function loadComponents() {
  let containers = {};
  if (isNode) {
    containers = getRootComponents().containers;
  } else {
    containers = window.__boring_internals.containers;
  }

  return containers;
}


export default function() {
  return loadComponents();
};
