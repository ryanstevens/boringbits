/**
 * This file is meant to define
 * configuration for localhost development.
 * By default boring assumes development
 * if there is NO NODE_ENV set.
 * It is probably best to set your
 * NODE_ENV=development in your .bashrc
 * or equiv to be explicit though.
 *
 * You should consider this a checked-in
 * file to your repo so ALL develpers
 * on the team get the same configuration
 * defaults for localhost dev.  If a
 * develop or group of developers want
 * exotic configs specific to them, then
 * simply drop am .env file into your project
 * root and key in an .env will take precednce
 */

module.exports = {
  envrionment: 'development',
  boring: {
    logger: {
      level: 'debug',
    },
  },
};
