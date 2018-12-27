// since this entrypoint is meant to run
// on both server and client, it's probably
// best to remove ./client when boring bumps
// to v4
module.exports = require('./client');
