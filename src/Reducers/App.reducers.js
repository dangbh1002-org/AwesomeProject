import { combineReducers } from 'redux';

// tasks
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

// user
const user = (
  state = {isFetching: true, data: null, loginError: false, loginMessage: null},
  action
) => {
  switch (action.type) {
    case 'REQUEST_USER':
      return { ...state, isFetching: true }
    case 'RECEIVE_USER':
      return { ...state, isFetching: false,
        data: action.data
      }
    case 'CLEAR_USER':
      return { ...state, data: null, isFetching: false}
    case 'ERROR':
      return { ...state, loginError: true, loginMessage: action.data}
    default:
      return state
  }
}

// TaskDetail
const taskDetail = (
  state = {imageArray: [], progress: 0, isLoading: false},
  action
) => {
  switch (action.type) {
    case 'ADD_IMAGE':
      return {
        ...state,
        imageArray: [...state.imageArray, action.data]
      }
    case 'REMOVE_IMAGE':
      return {
        ...state,
        imageArray: [
          ...state.imageArray.slice(0, action.index),
          ...state.imageArray.slice(action.index + 1)
        ]
      }

    case 'START_UPLOAD':
      return {
        ...state,
        isLoading: true
      }
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: action.data
      }
    case 'UPLOAD_DONE':
      return {
        ...state,
        imageArray: [],
        progress: 0,
        isLoading: false
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  user,
  tasks,
  taskDetail
});

export default rootReducer;
