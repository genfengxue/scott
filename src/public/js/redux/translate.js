import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVED_LESSON = 'RECEIVED_LESSON';
export const TRANSLATE_ERRORS = 'TRANSLATE_ERRORS';
export const SHOW_TRANSLATE_ANSWER = 'SHOW_TRANSLATE_ANSWER';
export const TRANSLATE_INIT = 'TRANSLATE_INIT';

// ------------------------------------
// Actions
// ------------------------------------
export const receivedLesson = createAction(RECEIVED_LESSON, (payload) => payload);
export const displayErrors = createAction(TRANSLATE_ERRORS, (payload) => payload);
export const showTranslateAnswer = createAction(SHOW_TRANSLATE_ANSWER);
export const translateInit = createAction(TRANSLATE_INIT);

export const fetchLessonAsync = (id) => {
  return async (dispatch) => {
    try {
      dispatch(translateInit());
      const response = await ajax.get(`/api/lessons/${id}`);
      dispatch(receivedLesson(response));
    } catch (err) {
      switch (true) {
      case err.status === 404:
        dispatch(displayErrors({server: '课程不存在'}));
        break;
      default:
        dispatch(displayErrors({server: '服务器错误，请重试'}));
        break;
      }
    }
  };
};

export const actions = {
  receivedLesson,
  fetchLessonAsync,
  displayErrors,
  showTranslateAnswer,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [RECEIVED_LESSON]: (state, {payload}) => {
    state.lesson = payload;
    state.errors = {};
    return Object.assign({}, state);
  },
  [TRANSLATE_ERRORS]: (state, {payload}) => {
    state.errors = payload;
    return Object.assign({}, state);
  },
  [SHOW_TRANSLATE_ANSWER]: (state) => {
    state.viewAnswer = true;
    return Object.assign({}, state);
  },
  [TRANSLATE_INIT]: (state) => {
    return {lesson: {}, errors: {}};
  }
}, {lesson: {}, errors: {}});
