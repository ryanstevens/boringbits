
module.exports = function(BoringInjections) {

  const {
    injecture,
    config,
  } = BoringInjections;

  const boringStrategies = config.get('boring.strategies', {});
  const projStrategies = config.get('strategies', {});

  function createStrategyReducer(key, strategy) {
    injecture.addInterfaceReducer(key, function(keys) {
      return keys.filter(keyObj => (keyObj.key === strategy));
    });
  }

  const combinedStrategies = Object.assign({}, boringStrategies, projStrategies);

  Object.keys(combinedStrategies).forEach(key => {
    const strategy = combinedStrategies[key];
    createStrategyReducer(key, strategy);
  });
};
