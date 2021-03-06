[![boringbits](https://raw.githubusercontent.com/ryanstevens/boringbits/master/docs/logo.png)](https://github.com/ryanstevens/boringbits)

A web framework that is fairly opininated, making as many boring boilerplate decisions for you so you can focus on your application.  React based, universial server side rendering by default, takes care of webpack and bablfying your code base out of the box.  

### Design Principles
* A core design principle of `boringbits` is a concept of [progressive recomposition](https://github.com/ryanstevens/boringbits/blob/master/docs/design-decisions.md#progressive-recomposition), which is the ability to break down boringbit's magic over time and replace it with your own magic.  
* Another key design approach of `boringbits` is to never run bundled code on the server, rather simply allow node to use it's tried and true native `require` even on ES7 and / or TypeScript react modules.  Bundlers such as `webpack` were originally designed to allow node style modules to run in the browsers, however bundling frontend code to run on node never made sense to the authors. Instead `boringbits` simply transpiles frontend code node compatable code, in other words `boringbits` babel's frontend code but does not webpack it for server execution, but it does both for client side execution.  This has a couple clear advantages
    * debugging and tooling will work better as node code runs the way node code is designed to run
    * There can be a cleaner seperation between node code, browser code, and browser code that needs to run in node.  Ultimately this will reduce the chance of server code ever from accidentally bundling onto the client.  


### Consider `boringapp` when...
* You are a backend engineer who wants to crank out a modern frontend web application and ship it straight to production where it just works and is rock solid.
* You are a frontend engineer who is tired of making all the millions of choices when developing a full stack node.js react application.
* You want a framework that is designed for you to go outside of it's guardrails, encouraging programmers to remove `boringbits` magic over time by replacing bits with your own magic.


### Technical Features
* Express based universal server side rendering
  * Preconfigured `react (v16.7.0)`, `redux (v4.0.1)` boilerplate on both server and client
  * Predefined folder structure so you don't have to overthink code organization
* Zero configuration of `react router (v4.3.1)`, simply make a new container file
* Built in unit testing with `jest (v24.1.0)`
* HMR on both client and server (dev mode only)
* All projects ship with `babel (v7)` / `webpack (v4.27)` preconfigured
  * ES7 decorator support on by default
  * TypeScript enabled, but mix and match ES6/7 with TS nbd
* Built in generators to get you scaffolded up and going __fast__
* Automatic route based code splitting
* Automatic component based code splitting __with__ dynamic lazy imports + SSR
* Ships with build in HA Proxy in a docker container to simulate load balanced SSL based environment over a real domain
  * Also has `redis`, `dynamodb`, `mysql` docker containers built in for those who want to go completely full stack local development
* Uses battle hardened server node.js best practices suitable to go straight into production taking care of enterprise concerns
  * Implements bunyan logging
  * Implements correlationID pattern, drops a `corrId` on every log line
  * Has an event based smart health check you can extend "child" health checks
  * Takes config both from checked in config files (via `node-config`) __and__ .env files.  Config key / values can be universal.


<sup>This is heavily inspired by [CRA](https://github.com/facebook/create-react-app) and [next.js](https://github.com/zeit/next.js/). Why not use those? If you like them and are achieving your goals by all means we encourage you keep using whatever framework you are most comfortable with! Boring is much more opinionated than both of these projects though and will always place developer productivity over flexibility.  Our primary design goal is to let the boring framework make all boilerplate decisions for you so you can concentrate building unique product as fast as possible.
</sup>

## Get Started

The best way to get started from scratch is to simply use the `create-boring-app` cli <sub>  __[[learn more]](https://github.com/ryanstevens/boringbits/tree/master/yo)__</sub>

```bash
npx create-boring-app my-new-app
```

> `create-boring-app` command will
> * Create a new directoring `my-new-app`
> * npm install `boring` and it's dependencies
> * Generate / scaffold a basic app for you (press `yes` on the CLI to take all the defaults)
> * Prompt you to boot up HA Proxy (press yes)
> * Boot up your app server
> * Open a webpage to the top level container it just scaffolded

`boring` support HMR so once you have your app running, simply change your react files found in `src/client/pages/demo` and see your changes reflect immediately in your browser.  `boring` also does universal rendering by default, yet does similar server side HMR techniques so if you do a hard refresh your SSR and hydrated client will always be in sync and reflect the same DOM.

If you need to stop your server and start it again, make sure you are in your applications directory and simply `npm start`

## Running in Production

Boring needs to be built via webpack, as well as the node code needs to be babeled.

```bash
npm run build

# you do not need to set the NODE_ENV on the command line,
# it is better simply to have this set as an env var for that user.
# The only requirement is the value needs to be set to `production`
NODE_ENV=production npm start
```
