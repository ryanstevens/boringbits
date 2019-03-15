module.exports = function(BoringInjections, {makeClassDecorator} = utils) {

  const log = makeClassDecorator(function(target) {

    return target;
  });

  return {
    log,
  };
};
