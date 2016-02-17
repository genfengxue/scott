import {createAction, handleActions} from 'redux-actions';

// ------------------------------------
// Constants
// ------------------------------------
export const TRANSLATE_ERRORS = 'TRANSLATE_ERRORS';
export const SHOW_TRANSLATE_ANSWER = 'SHOW_TRANSLATE_ANSWER';
export const TRANSLATE_INIT = 'TRANSLATE_INIT';
export const TOGGLE_COLLECTION_MODAL = 'TOGGLE_COLLECTION_MODAL';
// ------------------------------------
// Actions
// ------------------------------------
export const displayErrors = createAction(TRANSLATE_ERRORS, (payload) => payload);
export const showTranslateAnswer = createAction(SHOW_TRANSLATE_ANSWER);
export const translateInit = createAction(TRANSLATE_INIT);
export const toggleCollectionModal = createAction(TOGGLE_COLLECTION_MODAL, (payload) => payload);

export const actions = {
  displayErrors,
  showTranslateAnswer,
  translateInit,
  toggleCollectionModal,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [TRANSLATE_ERRORS]: (state, {payload}) => {
    state.errors = payload;
    return Object.assign({}, state);
  },
  [SHOW_TRANSLATE_ANSWER]: (state) => {
    state.viewAnswer = true;
    return Object.assign({}, state);
  },
  [TRANSLATE_INIT]: () => {
    return {errors: {}};
  },
  [TOGGLE_COLLECTION_MODAL]: (state, {payload}) => {
    state.showCollectionModal = payload;
    return Object.assign({}, state);
  },
}, {errors: {}});
