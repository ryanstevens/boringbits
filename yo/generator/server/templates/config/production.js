/**
 * This is your production configuration
 * file.  You MUST set NODE_ENV=proudction
 * in order for boring and your program
 * to be production.
 *
 * DO NOT PUT SECRETS HERE.  This file
 * is intended to be checked in, so
 * any secrets in source control is
 * by definition not a secret.
 * `boring-config` uses `node-config`
 * under the hood and they have their
 * own recommendation on managing secrets.  https://github.com/lorenwest/node-config/wiki/Securing-Production-Config-Files
 *
 * Depending on your organizations
 * internal policy on handling secrets,
 * you can always set environmental
 * variables where only the system user
 * running node has access to them. OR
 * drop a .env file with secrets assuming
 * you lock down read permissions to that file
 */

module.exports = {
  envrionment: 'production',
};
