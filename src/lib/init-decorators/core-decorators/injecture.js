import injecture from 'injecture';

module.exports = function(BoringInjections) {

  function register(name, registerOptions) {

    if (typeof name === 'object' && !registerOptions) {
      registerOptions = name;
    }

    return function(target) {

      injecture.registerClassByKey(name || target.name, target, registerOptions);
      return target;
    };
  };

  return {
    register
  }
};
