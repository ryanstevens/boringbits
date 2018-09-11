
module.exports = async function registerMiddleware(boring) {

  return function(req, res, next) {
    res.send('B');
    next();
  }
}