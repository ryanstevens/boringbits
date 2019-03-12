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
    const newProp = {
      ...props,
    };

    /**
     * React helmet will blow away anything previous set in html and body.
     *
     * Since boring merges in html / body styles we explictly mutate
     * the children of a <Helmet> tag to remove html / body elements
     *
     * I'm sure someone on the interweb will explain why this is a horrible
     * thing I've done, happy to discuss this on my fake twitter profile.  - RCS
     */
    const children = [].concat(props.children || []);
    newProp.children = children.filter(child => {
      return (child.type !== 'html' && child.type !== 'body');
    });

    return (
      <OriginalHelmet {...newProp}>
        {newProp.children}
      </OriginalHelmet>
    );
  }

};
