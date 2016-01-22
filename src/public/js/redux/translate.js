import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';

// ------------------------------------
// Constants
// ------------------------------------
export const TRANSLATE_ERRORS = 'TRANSLATE_ERRORS';
export const SHOW_TRANSLATE_ANSWER = 'SHOW_TRANSLATE_ANSWER';
export const TRANSLATE_INIT = 'TRANSLATE_INIT';

// ------------------------------------
// Actions
// ------------------------------------
export const displayErrors = createAction(TRANSLATE_ERRORS, (payload) => payload);
export const showTranslateAnswer = createAction(SHOW_TRANSLATE_ANSWER);
export const translateInit = createAction(TRANSLATE_INIT);

export const actions = {
  displayErrors,
  showTranslateAnswer,
  translateInit,
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
  [TRANSLATE_INIT]: (state) => {
    return {errors: {}};
  }
}, {errors: {}});
