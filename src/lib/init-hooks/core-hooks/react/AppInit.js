import React from 'react';
import { SheetsRegistry } from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider  } from "react-redux";
import { createGenerateClassName } from '@material-ui/core/styles';
import { routerMiddleware, connectRouter } from 'connected-react-router'
import isNode from 'detect-node';

function performDOMTasks() {
  try {
    if (!isNode) {
      
      var jssStyles = window.document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }      
      
      if (window.__PRELOADED_STATE__) {
        preloadedState = window.__PRELOADED_STATE__;
        delete window.__PRELOADED_STATE__;
      }

      return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    }    
  }
  catch(e) {}
  return compose;
}
 
export default function getAppComponents(dependencies) {

  // Grab the state from a global variable injected into the server-generated HTML
  var preloadedState = undefined;
  var App  = dependencies.App;
  var reducers = dependencies.reducers;
  var composeEnhancers = performDOMTasks();

  var middleware = [];
  if (dependencies.history) {
    middleware.push(routerMiddleware(dependencies.history));
    reducers.router = connectRouter(dependencies.history);
  }

  var Router = dependencies.Router;
  var enhancer =  composeEnhancers(applyMiddleware.apply(null, middleware));

  var store = createStore(
    combineReducers(reducers),
    preloadedState,
    enhancer
  );

  // Create a new class name generator.
  var generateClassName = createGenerateClassName();
  var sheetsRegistry = new SheetsRegistry();

  /**
   * This meant to be called on the server
   * AFTER MAIN is renedered.
   */
  function getStyleSheets() {
    return sheetsRegistry.toString();
  }

  function Container() {
    return (
      <Provider store={store}>
        <Router>
          <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
            <App />
          </JssProvider>
        </Router>
      </Provider>
    );
  }
  return {
    Container: Container,
    getStyleSheets: getStyleSheets,
    store: store
  }

}