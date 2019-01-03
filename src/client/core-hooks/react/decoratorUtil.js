import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';


export function makeDecorator(Wrapper, options = {}) {

  return function decoratorProxy(Target) {

    return hoistNonReactStatic(class extends React.Component {

      render() {
        return (
          <Wrapper targetProps={this.props} options={options}>
            <Target {...this.props} />
          </Wrapper>
        );
      }
    }, Target);

  };

};
