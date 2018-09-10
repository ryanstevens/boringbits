
import * as endpoint from './endpoint'

function subscribeDecorators(emitter) {
  endpoint.subscribeDecorators(emitter);
}

module.exports = {
  endpoint,
  subscribeDecorators: subscribeDecorators
}