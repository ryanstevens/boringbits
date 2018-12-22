const parse = require('csv-parse');
const retryerer = require('./retryerer');


function praseResponse(lines) {

  return new Promise((resolve, reject) => {
    // Create the parser
    const parser = parse({
      delimiter: ',',
      columns: true,
    }, function(err, records) {
      resolve(records);
    });

    // lines.split('\n').forEach(line => {
    //   parser.write(line);
    // });
    parser.write(lines.substring(2));
    // Close the readable stream
    parser.end();
  });

}


module.exports = async function checkProxy() {

  const haProxyResponse = await retryerer('http://www.boringlocal.com/__haproxy_stats;csv;norefresh', 3);
  if (!haProxyResponse) return {haProxyStatus: 'DOWN', appStatus: 'DOWN'};

  const nodeBackend = (await praseResponse(haProxyResponse)).filter(result => result.svname === 'node_server').pop();
  if (nodeBackend && nodeBackend.status == 'UP') return {haProxyStatus: 'UP', appStatus: 'UP'};

  return {haProxyStatus: 'UP', appStatus: 'DOWN'};
};
