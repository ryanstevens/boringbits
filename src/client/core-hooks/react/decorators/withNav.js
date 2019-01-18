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

  render() {
    const {Target, propsForTarget} = this.props;
    const WrappedTarget = withRouter(Target);
    return (
      <>
        <WrappedTarget {...propsForTarget} navPush={this.props.navPush} />
      </>

    );
  }
}

export default WithNav;
