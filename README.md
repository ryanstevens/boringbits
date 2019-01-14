# boring

A web framework that just works.  React based, universial by default, takes care of webpack and bablfying your code base out of the box.

This is heavily inspired by [CRA](https://github.com/facebook/create-react-app) and [next.js](https://github.com/zeit/next.js/). Why not use those? If you like them and are achieving your goals by all means we encourage you keep using whatever framework you are most comfortable with! Boring is much more opinionated than both of these projects though and will always place developer productivity over flexibility.  Our primary design goal is to let the boring framework make all boilerplate decisions for you so you can concentrate building unique product as fast as possible.

## Get Started

The best way to get started from scratch is to simply use the `create-boring-app` cli.  The following command will create a new directoring `my-new-app`, npm install `boring` and it's dependencies, generate / scaffold a basic app for you, then finally boot up your app server. 

```bash
npx create-boring-app my-new-app
```

`boring` support HMR so once you have your app running, simply change your react files found in `src/client/pages/demo` and see your changes reflect immediately in your browser.  `boring` also does universal rendering by default, yet does similar server side HMR techniques so if you do a hard refresh your SSR and hydrated client will always be in sync and reflect the same DOM.  

