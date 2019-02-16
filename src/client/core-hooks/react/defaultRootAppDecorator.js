import React from 'react';

export default function decorate(RootApp) {

  // eslint-disable-next-line valid-jsdoc
  /**
   * This is essentially a no-op wrapper
   * meant to be overriden
   */
  return function Wrapper() {
    return (
      <RootApp />
    );
  };
};
