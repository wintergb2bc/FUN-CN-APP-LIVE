import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import AppReducer from "../reducers/AppReducer";

const logger = store => next => action => {
  if (typeof action === 'function') {
      console.log('%c dispatching a function ', 'background: #ABDCFB; color: #000');
  } else {
      console.log('%c dispatching', 'background: #ABDCFB; color: #000');
      console.log(action)

  }
  const result = next(action);
  console.log('nextState ', store.getState());
  return result;
};

const middlewares = [
  logger,
  thunk,
];

/**
 * 创建store
 */
export default createStore(AppReducer, applyMiddleware(...middlewares));

