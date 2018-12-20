// probably import reducers from other places here

// feel free to change / delete this
function messageReducer(state = {msg: 'hello'}, action) {
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
