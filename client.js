/**
 * This module will NOT be babel'd into dist
 * as it is meant to be required by client side
 * code via `require('boringbits/client')`
 * So please write vanilla old school JS
 */

var react = require('react');
var redux = require('redux');
var injecture = require('./dist/node_modules/injecture');

module.exports = {
  renderRedux: window.__boring.renderRedux,
  react: react,
  redux: redux,
  injecture: injecture
};
