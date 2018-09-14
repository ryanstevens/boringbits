function func(req, res, next) {
  res.send('B');
  next();
}

module.exports = async function registerMiddleware(boring) {

  return {
    name: 'foo', 
    func 
  }
}