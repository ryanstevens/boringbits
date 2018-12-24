const request = require('request');

function makeRequest(url) {
  console.log('Attempting ' + url);
  return new Promise((resolve, reject) => {
    request.get(url, function(err, resp, body) {
      if (err) return reject(err);
      if (resp.statusCode !== 200) return reject('non 200 statuCode, ' + resp.statusCode);
      resolve(body);
    });
  });
}

function sleep(seconds) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, seconds * 1000);
  });
}


async function tryPoll(url, attempt, sleepTime = 2) {

  try {
    return await makeRequest(url);
  } catch (e) {
    console.log(e);
    if (attempt === 0) return false;
    await sleep(sleepTime);
    const result = await tryPoll(url, --attempt);
    return result;
  }
}

module.exports = tryPoll;
