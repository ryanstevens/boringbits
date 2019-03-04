import injecture from 'injecture';
import { makeClassDecorator } from '../../decorators';

module.exports = function(BoringInjections) {

  const register = makeClassDecorator(function(target, name, registerOptions) {
    if (typeof name === 'object' && !registerOptions) {
      registerOptions = name;
      name = null;
    }

    injecture.registerClassByKey(name || target.name, target, registerOptions);

    return target;
  });

  const registerSingleton = makeClassDecorator(function(target, name, registerOptions) {
    if (typeof name === 'object' && !registerOptions) {
      registerOptions = name;
      name = null;
    }

    if (!registerOptions) registerOptions = {};
    injecture.registerClassByKey(name || target.name, target, {
      ...registerOptions,
      singleton: true
    });

    return target;
  });

  return {
    register,
    registerSingleton
  };
};
