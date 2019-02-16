import {makeDecorator} from './decoratorUtil';
import hoistNonReactStatic from 'hoist-non-react-statics';
import React from 'react';

if (!global.__boring_internals) {
  global.__boring_internals = {};
}

if (!global.__boring_internals.decorators) {
  global.__boring_internals.decorators = {};
}

export default function proxyToGlobalDecorator(decorator, path) {
  global.__boring_internals.decorators[path] = decorator;

  const WrappedModuleToDecorate = hoistNonReactStatic(class extends React.Component {
    render() {
      const FreshModule = global.__boring_internals.decorators[path];
      return <FreshModule {...this.props} />;
    }
  }, decorator);

  return makeDecorator(WrappedModuleToDecorate);
};
