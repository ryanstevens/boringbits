/**
 * This file is used to append to the generated entrypoint
 * of beforeEntry.  It's purpose is to maintain the code
 * in a JS file that can be linted,
 * as opposed to writing a string with JS.
 *
 * This function will ultimately be toString'd then ran
 * through babel with a target of ie11. Both
 * the containes and modules varaiables will be in scope
 */
export default function beforeEntryLoader() {

  // THIS IS A GENERATED FILE, PLEASE DO NOT MODIFY


  const internals = window.__boring_internals;

  internals.containers = containers || [];
  internals.modules = modules || {};
  internals.decorators = decorators || {};

  if (!internals.hot) {
    internals.hot = {
      subscribers: [],
      subscribe: function(fn) {
        this.subscribers.push(fn);
      },
      notify: function() {
        this.subscribers.forEach(fn => {
          console.log('notifying subscriber of a change');
          fn();
        });
      },
    };
  } else {
    setTimeout(() => {
      // I know this seems jank but it's ONLY
      // when we are in a partial state because HMR
      internals.hot.notify();
    }, 1);
  }

  if (module.hot) {
    module.hot.accept(err => console.log('error reloading', err));
  }

  // GENERATED_CODE
};


