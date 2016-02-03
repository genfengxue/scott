import {createAction, handleActions} from 'redux-actions';
// ------------------------------------
// Constants
// ------------------------------------
export const LISTEN_ERRORS = 'LISTEN_ERRORS';
export const SHOW_LISTEN_ANSWER = 'SHOW_LISTEN_ANSWER';
export const LISTEN_INIT = 'LISTEN_INIT';

// ------------------------------------
// Actions
// ------------------------------------
export const displayErrors = createAction(LISTEN_ERRORS, (payload) => payload);
export const showListenAnswer = createAction(SHOW_LISTEN_ANSWER);
export const listenInit = createAction(LISTEN_INIT);

export const actions = {
  displayErrors,
  showListenAnswer,
  listenInit,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [LISTEN_ERRORS]: (state, {payload}) => {
    state.errors = payload;
    return Object.assign({}, state);
  },
  [SHOW_LISTEN_ANSWER]: (state) => {
    state.viewAnswer = true;
    return Object.assign({}, state);
  },
  [LISTEN_INIT]: () => {
    return {errors: {}};
  },
}, {errors: {}});
