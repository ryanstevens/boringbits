const Server = require('./boring').Server;
const boring = new Server();


boring.start()
  .then(finalConfig => {});
