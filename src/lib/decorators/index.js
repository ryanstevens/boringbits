
import * as router from './router';

function subscribeDecorators(emitter) {
  router.subscribeDecorators(emitter);
}

module.exports = {
  router: router.default,
  subscribeDecorators,
};
