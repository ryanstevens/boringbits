import {withStyles} from '@material-ui/core/styles';

import React from 'react';

class WithStyles extends React.Component {

  static hasArgs = true;

  render() {

    const Target = this.props.Target;
    const decoratorArgs = this.props.decoratorArgs;
    const WrappedTarget = withStyles(...decoratorArgs)(Target);

    const {propsForTarget} = this.props;
    return <WrappedTarget {...propsForTarget} />;
  }
}

export default WithStyles;
