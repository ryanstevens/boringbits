const parse = require('csv-parse');
const request = require('request');

function makeRequest(url) {
  console.log('Attempting ' + url);
  return new Promise((resolve, reject) => {
    request.get(url, function(err, resp, body) {
      if (err) return reject(err);
      resolve(body);
    });
  });
}

function sleep(seconds) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, seconds * 1000);
  });
}

function parseFile(lines) {

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

async function tryPollHaProxy(attempt) {
  if (attempt === 0) return false;
  try {
    const proxyOutput = await makeRequest('http://www.boringlocal.com/__haproxy_stats;csv;norefresh');
    // do stuffs
    const proxyResults = await parseFile(proxyOutput);

    return proxyResults;
  } catch (e) {
    console.log('Problem hitting ha proxy', e);
    await sleep(2);
    return await tryPollHaProxy(--attempt);
  }
}

module.exports = async function checkProxy() {

  const haProxyResponse = await tryPollHaProxy(3);
  if (!haProxyResponse) return {haProxyStatus: 'DOWN', appStatus: 'DOWN'};

  const nodeBackend = haProxyResponse.filter(result => result.svname === 'node_server');
  if (nodeBackend && nodeBackend.status === 'UP') return {haProxyStatus: 'UP', appStatus: 'UP'};

  return {haProxyStatus: 'UP', appStatus: 'DOWN'};
};
