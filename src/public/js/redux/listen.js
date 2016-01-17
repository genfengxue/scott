import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';
import unionBy from 'lodash/unionBy';
// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVED_LESSON = 'RECEIVED_LESSON';
export const LISTEN_ERRORS = 'LISTEN_ERRORS';
export const SHOW_LISTEN_ANSWER = 'SHOW_LISTEN_ANSWER';
export const LISTEN_INIT = 'LISTEN_INIT';

// ------------------------------------
// Actions
// ------------------------------------
export const receivedLesson = createAction(RECEIVED_LESSON, (payload) => payload);
export const displayErrors = createAction(LISTEN_ERRORS, (payload) => payload);
export const showListenAnswer = createAction(SHOW_LISTEN_ANSWER);
export const listenInit = createAction(LISTEN_INIT);

export const fetchLessonAsync = (id) => {
  return async (dispatch) => {
    try {
      dispatch(listenInit());
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
  showListenAnswer,
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
  [LISTEN_ERRORS]: (state, {payload}) => {
    state.errors = payload;
    return Object.assign({}, state);
  },
  [SHOW_LISTEN_ANSWER]: (state) => {
    state.viewAnswer = true;
    return Object.assign({}, state);
  },
  [LISTEN_INIT]: (state) => {
    return {lesson: {}, errors: {}};
  }
}, {lesson: {}, errors: {}});
