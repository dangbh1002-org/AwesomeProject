import { combineReducers } from 'redux';

const tasks = (
  state = { isFetching: false, data: [] },
  action
) => {
  switch (action.type) {
    case 'REQUEST_POSTS':
      return { ... state, isFetching: true}
    case 'RECEIVE_POSTS':
      return { ...state, isFetching: false,
        data: action.data
      }
    default:
      return state
  }
}

const user = (
  state = {isFetching: false, data: null},
  action
) => {
  switch (action.type) {
    case 'REQUEST_USER':
      return { ...state, isFetching: true }
    case 'RECEIVE_USER':
      return { ...state, isFetching: false,
        data: action.data
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  user,
  tasks
});

export default rootReducer;
