import React from 'react';
import {Route, Switch} from 'react-router-dom';
import isNode from 'detect-node';
import Loadable from 'react-loadable';
import {frontloadConnect} from 'react-frontload';
import defer from 'deferitize';

function getRootComponents() {
  const rootPath = '../../../lib/init-hooks/core-hooks/react/getNodeRootComponents'; // this simply ensures the node side isn't webpacked bundled
  return require(rootPath)();
}

const loaderPromise = defer();
let ran = false;

let containers;
function loadComponents() {
  if (ran) return;
  if (isNode) {
    const rootContainers = getRootComponents().containers;
    containers = Object.keys(rootContainers).reduce((acc, containerName) => {
      const Component = rootContainers[containerName];
      // eslint-disable-next-line new-cap
      acc[containerName] = Loadable({
        loader: () => Promise.resolve(Component),
        loading: () => <></>,
        modules: [Component.importPath],
      });
      acc[containerName].path = Component.path;
      return acc;
    }, {});

    Promise.all(
      Object
        .keys(containers)
        .map(key => containers[key].loader)
    ).then(loaderPromise.resolve);

  } else {
    containers = window.__boring_internals.containers;
  }
  ran = true;
}

@frontloadConnect(function() {
  return loaderPromise;
})
class RouterSwitch extends React.Component {

  componentWillMount() {
    loadComponents();
  }

  render() {

    const containerStack = Object.keys(containers).map(name => {
      return containers[name];
    }).filter(container => container.path)
      .sort((containerA, containerB) => {
        if (containerA.path.length<containerB.path.length) return 1;
        if (containerA.path.length>containerB.path.length) return -1;
        return 0;
      });

    return (
      <Switch>
        {this.props.children}

        {containerStack.map(component => {
          return (
            <Route
              key={component.path} // <-- that should work riiiiggggt?
              path={component.path}
              component={component}
            />
          );
        })}
      </Switch>
    );
  }
}

export default RouterSwitch;
