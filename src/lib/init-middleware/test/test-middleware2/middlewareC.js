
module.exports = async function registerMiddleware(boring) {

  return {
    name: 'foo', 
    func: function(req, res, next) {
      res.send('B');
      next();
    }
  }
}