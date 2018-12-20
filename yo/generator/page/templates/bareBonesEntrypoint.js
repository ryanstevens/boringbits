
console.log('I\'m a vanilla javascript file, who needs a framework');

// for fun change the name to see validate Hot Relaod is working
const name = 'Josh';

function printMsg(data) {
  document.getElementById('root').innerHTML =
  'Message from server<br />******************<br />' + data.msg;
  return Promise.resolve();
}

fetch('/data.json', {
  method: 'POST',
  body: JSON.stringify({name}),
  headers: {'Content-Type': 'application/json; charset=utf-8'},
}).then(response => response.json())
  .then(printMsg)
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });

if (module.hot) module.hot.accept((err) => console.log('error reloading', err));
