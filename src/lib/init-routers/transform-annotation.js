
module.exports = function convertClassToMetaData(classMetadata) {

  const endpoints = classMetadata.endpoints || [];

  // rewrite endpoints from an object into an array.
  classMetadata.endpoints = Object.keys(endpoints).map(name => {
    return endpoints[name];
  });

  return classMetadata;
};
