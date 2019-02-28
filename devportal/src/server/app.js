const Server = require('boringbits').Server;
const boring = new Server();


boring.start()
  .then(finalConfig => {
    // boring has been started, feel free to inspect
    // the `finalConfig` that also contains the
    // webpack config used to boot boring
  });
