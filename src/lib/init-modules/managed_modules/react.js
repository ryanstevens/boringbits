import react from 'react';
import redux from 'redux';
import ReactDOMServer from 'react-dom/server';

/*
 * This module exposes the react modules
 * used by boring both by mutating the injections
 * and using injecture.  It may be important
 * for the webapp to use the exact same
 * version of the modules boring uses.
 */
module.exports = function(BoringInjections) {
  const {
    injecture,
  } = BoringInjections;

  BoringInjections.react = react;
  BoringInjections.redux = redux;
  BoringInjections.ReactDOMServer = ReactDOMServer;

  injecture.register('react', function() {
    return react;
  }, {
    singleton: true,
  });

  injecture.register('redux', function() {
    return redux;
  }, {
    singleton: true,
  });

  injecture.register('ReactDOMServer', function() {
    return ReactDOMServer;
  }, {
    singleton: true,
  });
};
