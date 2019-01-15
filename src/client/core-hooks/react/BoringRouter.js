import React from 'react';
import {Route, Switch} from 'react-router-dom';
import getComponents from './getRootComponents';

class RouterSwitch extends React.Component {

  componentWillMount() {
    this.containers = getComponents().containers;
  }

  render() {

    const containerStack = Object.keys(this.containers).map(name => {
      return this.containers[name];
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
          // component.preload();
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
