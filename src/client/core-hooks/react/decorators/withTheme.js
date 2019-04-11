import {withTheme} from '@material-ui/core/styles';

import React from 'react';

class WithTheme extends React.Component {

  static hasArgs = true;

  render() {

    const Target = this.props.Target;
    const decoratorArgs = this.props.decoratorArgs;
    const WrappedTarget = withTheme(...decoratorArgs)(Target);

    const {propsForTarget} = this.props;
    return <WrappedTarget {...propsForTarget} />;
  }
}

export default WithTheme;
