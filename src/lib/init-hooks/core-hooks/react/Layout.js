import React from 'react';

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

    const styles = this.props.styles || {};

    const htmlStyle = {
      minHeight: '100%',
      padding: '0px',
      margin: '0px',
      overflow: 'auto',
      ...(styles.html || {}),
    };

    const bodyStyle = {
      minHeight: '100vh',
      padding: '0px',
      margin: '0px',
      ...(styles.body || {}),
    };

    const rootStyle = {
      height: '100%',
      width: '100%',
      ...(styles.root || {}),
    };

    return (
      <html style={htmlStyle}>
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
        <body style={bodyStyle}>
          <style dangerouslySetInnerHTML={{__html: this.props.inlineCSS}} id="jss-server-side"></style>
          <div style={rootStyle} id="root" dangerouslySetInnerHTML={{__html: this.props.containerHTML}}>

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
