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

  if (!window.__boring_internals) {
    window.__boring_internals = {
      wutsthis: 'DO NOT LOOK HERE OR YOU ARE FIRED',
    };
  }

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
    internals.hot.notify();
  }

  if (module.hot) {
    module.hot.accept(err => console.log('error reloading', err));
  }

};


