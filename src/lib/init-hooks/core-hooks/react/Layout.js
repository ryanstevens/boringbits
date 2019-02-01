import React from 'react';
import ReactDOMServer from 'react-dom/server';


module.exports = class HTML extends React.Component {
  render() {

    const pageInjections = {
      headLinks: [],
      headScripts: [],
      bodyEndScripts: [],
      inlineHeadScripts: [],
      ...this.props.pageInjections,
    };


    const reduxHtml = `window.__PRELOADED_STATE__=${JSON.stringify(this.props.redux_state).replace(/</g, '\\u003c')}`;

    const appVars = `
      window.app_vars = {
        server_load_time: ${(new Date().getTime())},
        client_load_start : (new Date()).getTime(),
        config: ${JSON.stringify(this.props.clientConfig || {})},
        loggedIn: ${this.props.locals.loggedIn}
      }

      ${pageInjections.inlineHeadScripts.map(script => `
      try {
        (function() {
          ${script}
        })();
      } catch(e) {
        console.log('error running inline script');
      }
      `).join(' ')}
    `;

    pageInjections.headLinks = pageInjections.headLinks.concat(this.props.locals.pageInjections.headLinks || []);
    pageInjections.headScripts = pageInjections.headScripts.concat(this.props.locals.pageInjections.headScripts || []);
    pageInjections.bodyEndScripts = pageInjections.bodyEndScripts.concat(this.props.locals.pageInjections.bodyEndScripts || []);

    pageInjections.headLinks = pageInjections.headLinks.map(link => {
      return (typeof link === 'string') ? {rel: 'stylesheet', type: 'text/css', href: link} : link;
    });

    pageInjections.headScripts = pageInjections.headScripts.map(script => {
      return (typeof script === 'string') ? {src: script} : script;
    });

    pageInjections.bodyEndScripts = pageInjections.bodyEndScripts.map(script => {
      return (typeof script === 'string') ? {src: script} : script;
    });


    return (
      <html style={{backgroundColor: '#F5F5F5'}}>
        <head>
          <meta charSet="utf-8" />

          <script dangerouslySetInnerHTML={{__html: appVars}}></script>

          <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>

          {
            pageInjections.headScripts.map((scriptObj) => <script key={scriptObj.src} {...scriptObj} />)
          }

          {
            pageInjections.headLinks.map((linkObj) => <link key={linkObj.href} {...linkObj} />)
          }
        </head>
        <body style={{height: '100%', padding: '0px', margin: '0px'}}>
          <style dangerouslySetInnerHTML={{__html: this.props.inlineCSS}} id="jss-server-side"></style>
          <div style={{width: '100%', height: '100%'}} id="root" dangerouslySetInnerHTML={{__html: this.props.containerHTML}}>

          </div>

          <script dangerouslySetInnerHTML={{__html: reduxHtml}}></script>
          {
            pageInjections.bodyEndScripts.map((scriptObj) => <script key={scriptObj.src} {...scriptObj} />)
          }
        </body>
      </html>
    );
  }
};
