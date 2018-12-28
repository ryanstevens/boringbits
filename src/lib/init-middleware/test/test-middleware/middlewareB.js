function middleware(req, res, next) {
  res.send('B');
  next();
}

module.exports = async function registerMiddleware(boring) {
  return middleware;
};
