module.exports = {
  "parserOptions": {
    "ecmaVersion": 9,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "experimentalObjectRestSpread": true,
    }
  },
  "parser": "babel-eslint",
  "rules" : {
    "import/no-extraneous-dependencies": false,
    "arrow-parens": 0,
    "require-jsdoc": 0,
    "prefer-spread": 1,
    "max-len": 1,
    "padded-blocks": 0,
    "no-unused-vars": 1,
    "indent":  ["error", 2, { "VariableDeclarator": 1 }]
  },
  "extends": "google"
};