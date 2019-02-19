import React from 'react';
import {withRouter} from 'react-router';

import {connect} from 'react-redux';
import {push} from 'connected-react-router';

@connect(
  null,
  dispatch => ({
    navPush: (page) => dispatch(push(page)),
  })
)
class WithNav extends React.Component {

  componentWillMount() {
    const Target = this.props.Target;
    this.WrappedTarget = withRouter(Target);
  }

  render() {
    const {propsForTarget} = this.props;
    const WrappedTarget = this.WrappedTarget;
    return <WrappedTarget {...propsForTarget} navPush={this.props.navPush} nav={this.props.navPush} />;
  }
}

export default WithNav;
