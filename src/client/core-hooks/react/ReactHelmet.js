import {Helmet as OriginalHelmet} from 'react-helmet';
import React from 'react';
import isNode from 'detect-node';

export function Helmet(props) {

  if (isNode) {
    return (
      <OriginalHelmet {...props}>
        {props.children}
      </OriginalHelmet>
    );

  } else {
    return (
      <OriginalHelmet {...props}></OriginalHelmet>
    );
  }

};
