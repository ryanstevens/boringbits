var assert = require('assert');
var proxyquire = require('proxyquire');
const logger = require('boring-logger');

describe('Init Endpoints', function() {


  function mockRequireAll(dataToMock) {
    return proxyquire('../init-endpoints', {
      'require-inject-all': function() {
        return new Promise((resolve) => {
          resolve(dataToMock);
        });
      }
    })
  }
 
  
  it('will install endpoint verbs', function(done) {

    const handlers = [];
    const init = mockRequireAll({
      "pageA": {
        endpoints: [
          {
            path: '/foo',
            methods: {
              get: function(req, res) {
                
              }
            }
          }
        ]
      }
    })
    const boring = {
      app: {
        get: function(path, handler) {
          handlers.push({path, handler});
        }
      }
    }

    init(boring).then(result => {
      assert.ok(result.pageA.endpoints, 'should have endpoints in resolved result');
      done()
    })
  });

});