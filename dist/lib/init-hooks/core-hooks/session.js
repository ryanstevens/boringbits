"use strict";

var cookieSession = require('cookie-session');

module.exports = function (BoringInjections) {
  const {
    boring
  } = BoringInjections;
  boring.after('add-hooks', function () {
    boring.app.use('boring-session', cookieSession({
      name: 'session',
      keys: [boring.config.get('boring.session.key1', 'woiejf*EFWjsd78yg@'), boring.config.get('boring.session.key2', '54we54fFEIH8y4tlkajE*Ygt@')],
      // Cookie Options
      maxAge: boring.config.get('boring.session.duration', 24) * 60 * 60 * 1000 // 24 hours

    }));
    return Promise.resolve();
  });
  return {
    name: 'boring-session'
  };
};
//# sourceMappingURL=session.js.map