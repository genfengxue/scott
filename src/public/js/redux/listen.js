import {createAction, handleActions} from 'redux-actions';
// ------------------------------------
// Constants
// ------------------------------------
export const LISTEN_ERRORS = 'LISTEN_ERRORS';
export const SHOW_LISTEN_ANSWER = 'SHOW_LISTEN_ANSWER';
export const LISTEN_INIT = 'LISTEN_INIT';
export const TOGGLE_COLLECTION_MODAL = 'TOGGLE_COLLECTION_MODAL';

// ------------------------------------
// Actions
// ------------------------------------
export const displayErrors = createAction(LISTEN_ERRORS, (payload) => payload);
export const showListenAnswer = createAction(SHOW_LISTEN_ANSWER);
export const listenInit = createAction(LISTEN_INIT);
export const toggleCollectionModal = createAction(TOGGLE_COLLECTION_MODAL, (payload) => payload);

export const actions = {
  displayErrors,
  showListenAnswer,
  listenInit,
  toggleCollectionModal,
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
  [TOGGLE_COLLECTION_MODAL]: (state, {payload}) => {
    state.showCollectionModal = payload;
    return Object.assign({}, state);
  },
}, {errors: {}});
