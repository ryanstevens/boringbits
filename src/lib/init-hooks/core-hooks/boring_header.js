
module.exports = function(BoringInjections) {

  const {
    boring,
  } = BoringInjections;


  boring.before('add-hooks', function() {
    boring.app.disable('x-powered-by');

    return Promise.resolve();
  });

  return {name: 'boring-headers'};
};
