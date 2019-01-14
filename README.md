# boring

A web framework that is crazy opininated, taking as many boilerplate decisions away from you as a programmer (some will love, some will hate and we feel that is okay).  React based, universial SSR rendering by default, takes care of webpack and bablfying your code base out of the box.

### Features
* Express based universal server side rendering
  * Preconfigured react, redux boilerplate on both server and client
  * Predefined folder structure so you don't have to overthink code organization
* Zero configuration of `react router`, simply make a new container file
* HMR on both client and server (dev mode only)
* All projects ship with babel / webpack preconfigured
  * ES7 decorator support on by default
  * TypeScript enabled, but mix and match ES6/7 with TS nbd
* Built in generators to get you scaffolded up and going __fast__
* Route based code splitting
* Component based code splitting _with_ dynamic lazy imports
* Ships with build in HA Proxy in a docker container to simulate load balance environment, and do 
* Uses battle harded server node.js best pracitces suitable to go straight into production taking care of enterprise concerns
  * Implements bunyan logging
  * Implements correlationID pattern, drops a `corrId` on every log line
  * Has an event based smart health check you can extend "child" health checks
  * Takes config both from checked in config files (via `node-config`) __and__ .env files.  Config key / values can be universal.
  

This is heavily inspired by [CRA](https://github.com/facebook/create-react-app) and [next.js](https://github.com/zeit/next.js/). Why not use those? If you like them and are achieving your goals by all means we encourage you keep using whatever framework you are most comfortable with! Boring is much more opinionated than both of these projects though and will always place developer productivity over flexibility.  Our primary design goal is to let the boring framework make all boilerplate decisions for you so you can concentrate building unique product as fast as possible.

## Get Started

The best way to get started from scratch is to simply use the `create-boring-app` cli.  

```bash
npx create-boring-app my-new-app
```

`create-boring-app` command will 
* Create a new directoring `my-new-app`
* npm install `boring` and it's dependencies
* Generate / scaffold a basic app for you (press `yes` on the CLI to take all the defaults)
* Prompt you to boot up HA Proxy (press yes)
* Boot up your app server
* Open a webpage to the top level container it just scaffolded

`boring` support HMR so once you have your app running, simply change your react files found in `src/client/pages/demo` and see your changes reflect immediately in your browser.  `boring` also does universal rendering by default, yet does similar server side HMR techniques so if you do a hard refresh your SSR and hydrated client will always be in sync and reflect the same DOM.  

If you need to stop your server and start it again, make sure you are in your applications directory and simply `npm start`

