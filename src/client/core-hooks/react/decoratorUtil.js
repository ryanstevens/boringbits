import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

function wrapDecorator(Wrapper, options, Target, decoratorArgs=[]) {

  if (Wrapper.beforeDecorate) {
    Wrapper.beforeDecorate(Target, decoratorArgs);
  }

  const NewTarget = hoistNonReactStatic(class extends React.Component {
    render() {
      return (
        <Wrapper propsForTarget={this.props} options={options} Target={Target} decoratorArgs={decoratorArgs}>
          {
            (options.renderTarget) ? <Target {...this.props} /> : null // don't render any children because renderTarget assumes the wrapper itself will render it
          }
        </Wrapper>
      );
    }
  }, Target);
  return NewTarget;
}

export function makeDecorator(Wrapper, options = {renderTarget: true}) {
  // TODO: support passing params to decorator
  return function decoratorProxy(...args) {

    if (Wrapper.hasArgs) {
      const decoratorArgs = args;
      return function decoratorProxyWithArgs(Target) {
        return wrapDecorator(Wrapper, options, Target, decoratorArgs);
      };
    } else {
      return wrapDecorator(Wrapper, options, args[0]);
    }
  };

};
