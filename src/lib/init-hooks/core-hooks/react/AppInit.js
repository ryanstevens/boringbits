import React from 'react';
import { SheetsRegistry } from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider  } from "react-redux";
import { createGenerateClassName } from '@material-ui/core/styles';
import { routerMiddleware, connectRouter } from 'connected-react-router'


export default function getAppComponents(dependencies= {}) {

  // Grab the state from a global variable injected into the server-generated HTML
  let preloadedState = undefined;
  const App  = dependencies.App;
  const reducers = dependencies.reducers;
  let composeEnhancers = compose;

  try {
    if (window) {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
      if (window.__PRELOADED_STATE__) {
        preloadedState = window.__PRELOADED_STATE__;
        delete window.__PRELOADED_STATE__;
      }
    }
  }
  catch(e) {}

  const middleware = [];
  if (dependencies.history) {
    middleware.push(routerMiddleware(dependencies.history));
    reducers.router = connectRouter(dependencies.history);
  }

  const Router = dependencies.Router;
  const enhancer =  composeEnhancers(applyMiddleware(...middleware));

  const store = createStore(
    combineReducers(reducers),
    preloadedState,
    enhancer
  );

  // Create a new class name generator.
  const generateClassName = createGenerateClassName();
  const sheetsRegistry = new SheetsRegistry();

  class Main extends React.Component {
    // Remove the server-side injected CSS.
    componentDidMount() {
      if (window && window.document) {
        const jssStyles = window.document.getElementById('jss-server-side');
        if (jssStyles && jssStyles.parentNode) {
          jssStyles.parentNode.removeChild(jssStyles);
        }
      }
    }

    render() {
      return (
        <Provider store={store}>
          <Router>
            <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
              <App />
            </JssProvider>
          </Router>
        </Provider>
      )

    }
  }


  /**
   * This meant to be called on the server
   * AFTER MAIN is renedered.
   */
  function getStyleSheets() {
    return sheetsRegistry.toString();
  }

  const Container = Main
  return {
    Container,
    getStyleSheets,
    store
  }

}