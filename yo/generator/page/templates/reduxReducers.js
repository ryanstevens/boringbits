// probably import reducers from other places here

// feel free to change / delete this
function messageReducer(state = {msg: 'THIS SHOULD NEVER BE VISIBLE', color: 'red'}, action) {
  if (action.type === 'updateMsg') {
    return {
      ...state,
      ...action.data,
    };
  }
  return state;
}

export default {
  message: messageReducer,
};
