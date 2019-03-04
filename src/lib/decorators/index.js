
import * as router from './router';


function subscribeDecorators(emitter) {
  router.subscribeDecorators(emitter);
}

function makeClassDecorator(classDecorator) {

  // first arg always neeed to be the decorator
  if (typeof classDecorator !== 'function') throw new Error('the argument must be a function which serves as the decorator');

  return function createdDecorator(...args) {

    function classDecoratorWrapper(target) {
      args.unshift(target);
      return classDecorator(...args);
    }

    // this assumes they used the decorator and did not want to pass any 
    // arguments to it
    if (args.length === 1 && typeof args[0] === 'function') {
      const target = args.shift();
      return classDecoratorWrapper(target);
    }
    else return classDecoratorWrapper;
  }; 
}

module.exports = {
  router: router.default,
  subscribeDecorators,
  makeClassDecorator
};
