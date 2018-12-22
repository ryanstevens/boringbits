import React from 'react';
import {Route, Switch} from 'react-router-dom';
import isNode from 'detect-node';

class RouterSwitch extends React.Component {

  render() {

    // Doing this temporarily which effecitvely
    // turns off server side rendering for all containers
    // Until SSR is more of a priority this is fine for now
    if (isNode) {
      return <></>;
    }

    const containers = window.__boring_internals.containers;

    return (
      <Switch>
        {this.props.children}

        {containers.map(component => {
          return (
            <Route
              key={component.path} // <-- that should work riiiiggggt?
              path={component.path}
              component={component.container}
            />
          );
        })}
      </Switch>
    );
  }
}

export default RouterSwitch;
