import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';
import unionBy from 'lodash/unionBy';
// ------------------------------------
// Constants
// ------------------------------------
export const LESSONS_INIT = 'LESSONS_INIT';
export const RECEIVED_PRONUNCIATION_LESSONS = 'RECEIVED_PRONUNCIATION_LESSONS';
export const RECEIVED_MORE_PRONUNCIATION_LESSONS = 'RECEIVED_MORE_PRONUNCIATION_LESSONS';
// ------------------------------------
// Actions
// ------------------------------------
export const lessonsInit = createAction(LESSONS_INIT);
export const receivedPronunciationLessons = createAction(RECEIVED_PRONUNCIATION_LESSONS, (payload) => payload);
export const receivedMorePronunciationLessons = createAction(RECEIVED_MORE_PRONUNCIATION_LESSONS, (payload) => payload);
export const fetchPronunciationLessonsAsync = (courseNo) => {
  return async (dispatch) => {
    try {
      const response = await ajax.get(`/api/pronunciation_courses/${courseNo}/lessons`, {page: 1});
      dispatch(receivedPronunciationLessons(response));
    } catch (err) {
      console.log('error');
    }
  };
};

export const fetchMorePronunciationLessonsAsync = (page, courseNo) => {
  return async (dispatch) => {
    try {
      const response = await ajax.get(`/api/pronunciation_courses/${courseNo}/lessons`, {page});
      dispatch(receivedMorePronunciationLessons(response));
    } catch (err) {
      console.log(err);
      // dispatch(receivedMorePronunciationLessons([]));
    }
  };
};


export const actions = {
  lessonsInit,
  receivedPronunciationLessons,
  fetchPronunciationLessonsAsync,
  receivedMorePronunciationLessons,
  fetchMorePronunciationLessonsAsync,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [LESSONS_INIT]: () => {
    return {docs: []};
  },
  [RECEIVED_PRONUNCIATION_LESSONS]: (state, {payload}) => {
    return payload;
  },
  [RECEIVED_MORE_PRONUNCIATION_LESSONS]: (state, {payload}) => {
    const {docs, total} = payload;
    state.total = total;
    state.docs = unionBy(state.docs, docs, '_id');
    return Object.assign({}, state);
  },
}, {docs: []});
