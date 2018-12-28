import React from 'react';
import {SheetsRegistry} from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import {Provider} from 'react-redux';
import {createGenerateClassName} from '@material-ui/core/styles';
import {routerMiddleware, connectRouter} from 'connected-react-router';
import isNode from 'detect-node';
import thunk from 'redux-thunk';


function extractStateFromDOM() {
  const state = {
    composeEnhancers: compose,
  };
  try {
    if (!isNode) {

      const jssStyles = window.document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }

      state.preloadedState = window.__PRELOADED_STATE__ || {};
      state.composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    }
  } catch (e) {}

  return state;
}

export default function getAppComponents(dependencies) {

  // Grab the state from a global variable injected into the server-generated HTML
  const domExtractedState = extractStateFromDOM();
  const preloadedState = domExtractedState.preloadedState;
  const composeEnhancers = domExtractedState.composeEnhancers;

  const App = dependencies.App;
  const reducers = dependencies.reducers;

  const middleware = [];
  if (dependencies.history) {
    middleware.push(routerMiddleware(dependencies.history));
    reducers.router = connectRouter(dependencies.history);
  }
  middleware.push(thunk);

  const Router = dependencies.Router;
  const enhancer = composeEnhancers(applyMiddleware(...middleware));

  const store = createStore(
    combineReducers(reducers),
    preloadedState,
    enhancer
  );

  // Create a new class name generator.
  const generateClassName = createGenerateClassName();
  const sheetsRegistry = new SheetsRegistry();

  // eslint-disable-next-line valid-jsdoc
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
    store: store,
  };

};
