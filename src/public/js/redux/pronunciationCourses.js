import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVED_PRONUNCIATION_COURSES = 'RECEIVED_PRONUNCIATION_COURSES';
export const RECEIVED_MODE_PRONUNCIATION_COURSES = 'RECEIVED_MODE_PRONUNCIATION_COURSES';

// ------------------------------------
// Actions
// ------------------------------------
export const receivedPronunciationCourses = createAction(RECEIVED_PRONUNCIATION_COURSES, (payload) => payload);
export const receivedMorePronunciationCourses = createAction(RECEIVED_MODE_PRONUNCIATION_COURSES, (payload) => payload);
export const fetchPronunciationCoursesAsync = () => {
  return async (dispatch) => {
    try {
      const response = await ajax.get('/api/pronunciation_courses/', {page: 1});
      dispatch(receivedPronunciationCourses(response));
    } catch (err) {
      console.log('redux/pronunciationCourses 21', err.toString());
    }
  };
};

export const fetchMorePronunciationCoursesAsync = (page) => {
  return async (dispatch) => {
    try {
      const response = await ajax.get('/api/pronunciation_courses/', {page});
      dispatch(receivedMorePronunciationCourses(response));
    } catch (err) {
      console.log('redux/pronunciationCourses 32', err);
    }
  };
};

export const actions = {
  receivedPronunciationCourses,
  fetchPronunciationCoursesAsync,
  fetchMorePronunciationCoursesAsync,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [RECEIVED_PRONUNCIATION_COURSES]: (state, {payload}) => {
    return payload;
  },
  [RECEIVED_MODE_PRONUNCIATION_COURSES]: (state, {payload}) => {
    const {docs, total} = payload;
    state.total = total;
    state.docs = unionBy(state.docs, docs, '_id');
    return Object.assign({}, state);
  },
}, {docs: []});
