import React from 'react';

function parseStyle(attrs) {
  const style = attrs.style || {};
  if ('style' in attrs) delete attrs.style;
  if (typeof style === 'string') throw new Error('Boring Layout does not support React Helmet style tag as strings.  Please pass in an object');
  return style;
}

module.exports = class HTML extends React.Component {
  render() {

    // Object.keys(this.props.helmet).forEach(key => {
    //   console.log('##' + key, this.props.helmet[key].toString());
    // });

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


    const htmlAttrs = this.props.helmet.htmlAttributes.toComponent();
    const bodyAttrs = this.props.helmet.bodyAttributes.toComponent();

    const htmlStyle = {
      minHeight: '100%',
      padding: '0px',
      margin: '0px',
      overflow: 'auto',
      ...(styles.html || {}),
      ...parseStyle(htmlAttrs),
    };

    const bodyStyle = {
      minHeight: '100vh',
      padding: '0px',
      margin: '0px',
      ...(styles.body || {}),
      ...parseStyle(bodyAttrs),
    };

    const rootStyle = {
      height: '100%',
      width: '100%',
      ...(styles.root || {}),
    };

    return (
      <html {...htmlAttrs} style={htmlStyle}>
        <head>
          {this.props.helmet.title.toComponent()}
          {this.props.helmet.meta.toComponent()}

          <script dangerouslySetInnerHTML={{__html: appVars}}></script>


          {
            pageInjections.headScripts.map((scriptObj) => <script key={scriptObj.src} {...scriptObj} />)
          }

          {
            pageInjections.headLinks.map((linkObj) => <link key={linkObj.href} {...linkObj} />)
          }

          {this.props.helmet.link.toComponent()}

        </head>
        <body {...bodyAttrs} style={bodyStyle}>
          <style dangerouslySetInnerHTML={{__html: this.props.inlineCSS}} id="jss-server-side"></style>

          {this.props.helmet.style.toComponent()}

          <div style={rootStyle} id="root" dangerouslySetInnerHTML={{__html: this.props.containerHTML}}></div>

          <script dangerouslySetInnerHTML={{__html: reduxHtml}}></script>

          {this.props.helmet.script.toComponent()}
          {
            pageInjections.bodyEndScripts.map((scriptObj) => <script key={scriptObj.src} {...scriptObj} />)
          }
        </body>
      </html>
    );
  }
};
