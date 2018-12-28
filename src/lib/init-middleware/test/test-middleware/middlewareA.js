function middleware(req, res, next) {
  res.send('A');
  next();
}

module.exports = async function registerMiddleware(boring) {

  return {
    name: 'midA',
    middleware,
  };
};
