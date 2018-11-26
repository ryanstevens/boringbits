/**
 * This module will NOT be babel'd into dist
 * as it is meant to be required by client side
 * code via `require('boringbits/client')`
 * So please write vanilla old school JS
 */

 var toExport = {};

 try {
   toExport = window.__boring;
 }
 catch(e) {};

module.exports = toExport;
