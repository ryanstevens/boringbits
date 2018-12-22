import React from 'react';
import {Route, Switch} from 'react-router-dom';
import isNode from 'detect-node';

class RouterSwitch extends React.Component {

  render() {

    if (isNode) {
      return <></>;
    }

    const containers = window.__boring_internals.containers;

    let key=0;
    return (
      <Switch>
        {this.props.children}

        {containers.map(component => {
          return (
            <Route
              key={key++}
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
