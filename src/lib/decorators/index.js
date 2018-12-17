
import * as router from './router';
import * as react from './react';


function subscribeDecorators(emitter) {
  router.subscribeDecorators(emitter);
}

module.exports = {
  router: router.default,
  react: react.default,
  subscribeDecorators,
};
