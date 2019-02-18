import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';


export function makeDecorator(Wrapper, options = {renderTarget: true}) {
  return function decoratorProxy(Target) {
    const NewTarget = hoistNonReactStatic(class extends React.Component {
      render() {
        return (
          <Wrapper propsForTarget={this.props} options={options} Target={Target}>
            {
              (options.renderTarget) ? <Target {...this.props} /> : null // don't render any children because renderTarget assumes the wrapper itself will render it
            }
          </Wrapper>
        );
      }
    }, Target);

    return NewTarget;

  };

};
