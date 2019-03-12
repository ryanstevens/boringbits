import {withStyles} from '@material-ui/core/styles';

import React from 'react';

class WithStyles extends React.Component {

  componentWillMount() {
    const Target = this.props.Target;
    this.WrappedTarget = withStyles(Target);
  }

  render() {
    const {propsForTarget} = this.props;
    const WrappedTarget = this.WrappedTarget;
    return <WrappedTarget {...propsForTarget} />;
  }
}

export default WithStyles;
