
import * as router from './router';

function subscribeDecorators(emitter) {
  router.subscribeDecorators(emitter);
}

module.exports = {
  router,
  subscribeDecorators,
};
