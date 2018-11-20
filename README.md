# boring

A web framework that just works.  React based, universial by default, takes care of webpack and bablfying your code base out of the box.

This is heavily inspired by [CRA](https://github.com/facebook/create-react-app) and [next.js](https://github.com/zeit/next.js/). Why not use those? If you like them and are achieving your goals by all means we encourage you keep using whatever framework you are most comfortable with! Boring is much more opinionated than both of these projects though and will always place developer productivity over flexibility.  Our primary design goal is to let the boring framework make all boilerplate decisions for you so you can concentrate building unique product as fast as possible.

## Get Started

#### Add boringbits to your project
```bash
npm install boringbits
```

#### Add a server file in `src/server/routers/home`
```JavaScript
module.exports = function setupRoute(boringApp) {

  // destructure decorators
  const {
    endpoint,
    get,
    reactEntry } = boringApp.decorators.router;

  @endpoint()
  class Home {


    @get('/')
    @reactEntry('home')
    page(req, res) {
      res.renderRedux();
    }

  }

}

```


#### Add a clientside file `src/client/pages/home/entrypoint.js`
```JavaScript
import { renderRedux } from 'boringbits/client';

const rootReducer = {};

renderRedux((
  <div>hello, I am a boring app</div>
), rootReducer);

if (module.hot)  module.hot.accept((err) => console.log("error reloading", err));
```

#### Start the server
```JavaScript

const Server = require('boringbits').Server;
const boring = new Server();

boring.start()
  .then(finalConfig => {
    console.log('Webpack config used', finalConfig);
  })

```