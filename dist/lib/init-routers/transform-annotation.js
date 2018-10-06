"use strict";

module.exports = function convert_class_to_endpoint(class_metadata) {
  const endpoints = class_metadata.endpoints || []; // rewrite endpoints from an object into an array.

  class_metadata.endpoints = Object.keys(endpoints).map(name => {
    return endpoints[name];
  });
  return class_metadata;
};
//# sourceMappingURL=transform-annotation.js.map