/* eslint-disable no-invalid-this */
import React from 'react';
import isNode from 'detect-node';
import {ConnectedRouter} from 'connected-react-router';

export default (props) => {
  return (
    <ConnectedRouter {...props}>
      {props.children}
    </ConnectedRouter>
  );
};
