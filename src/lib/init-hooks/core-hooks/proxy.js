module.exports = function(BoringInjections) {

  const {
    boring,
  } = BoringInjections;

  boring.before('add-hooks', function() {

    boring.app.set('trust proxy', true);
    return Promise.resolve();

  });

  return {name: 'trust-proxy'};
};
