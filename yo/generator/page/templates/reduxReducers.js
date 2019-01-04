// probably import reducers from other places here

// feel free to change / delete this
function messageReducer(state = {msg: 'Hello, this page is server side rendered.  We are now making an ajax call to get an updated message'}, action) {
  if (action.type === 'updateMsg') {
    return {
      msg: action.msg,
    };
  }
  return state;
}

export default {
  message: messageReducer,
};
