import {createAction, handleActions} from 'redux-actions';

// ------------------------------------
// Constants
// ------------------------------------
export const TRANSLATE_ERRORS = 'TRANSLATE_ERRORS';
export const SHOW_TRANSLATE_ANSWER = 'SHOW_TRANSLATE_ANSWER';
export const TRANSLATE_INIT = 'TRANSLATE_INIT';
export const TOGGLE_COLLECTION_MODAL = 'TOGGLE_COLLECTION_MODAL';
export const TOGGLE_REVIEW_MODAL = 'TOGGLE_REVIEW_MODAL';
export const TOGGLE_METHOD_MODAL = 'TOGGLE_METHOD_MODAL';
export const TOGGLE_FEEDBACK_MODAL = 'TOGGLE_FEEDBACK_MODAL';

// ------------------------------------
// Actions
// ------------------------------------
export const displayErrors = createAction(TRANSLATE_ERRORS, (payload) => payload);
export const showTranslateAnswer = createAction(SHOW_TRANSLATE_ANSWER);
export const translateInit = createAction(TRANSLATE_INIT);
export const toggleCollectionModal = createAction(TOGGLE_COLLECTION_MODAL, (payload) => payload);
export const toggleReviewModal = createAction(TOGGLE_REVIEW_MODAL, (payload) => payload);
export const toggleMethodModal = createAction(TOGGLE_METHOD_MODAL, (payload) => payload);
export const toggleFeedbackModal = createAction(TOGGLE_FEEDBACK_MODAL, (payload) => payload);

export const actions = {
  displayErrors,
  showTranslateAnswer,
  translateInit,
  toggleCollectionModal,
  toggleReviewModal,
  toggleMethodModal,
  toggleFeedbackModal,
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
  [TOGGLE_REVIEW_MODAL]: (state, {payload}) => {
    state.showReviewModal = payload;
    return Object.assign({}, state);
  },
  [TOGGLE_METHOD_MODAL]: (state, {payload}) => {
    state.showMethodModal = payload;
    return Object.assign({}, state);
  },
  [TOGGLE_FEEDBACK_MODAL]: (state, {payload}) => {
    state.showFeedbackModal = payload;
    return Object.assign({}, state);
  },
}, {errors: {}});
