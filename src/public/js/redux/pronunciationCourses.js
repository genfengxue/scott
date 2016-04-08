import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVED_PRONUNCIATION_COURSES = 'RECEIVED_PRONUNCIATION_COURSES';

// ------------------------------------
// Actions
// ------------------------------------
export const receivedPronunciationCourses = createAction(RECEIVED_PRONUNCIATION_COURSES, (payload) => payload);

export const fetchPronunciationCoursesAsync = () => {
  return async (dispatch) => {
    try {
      const response = await ajax.get('/api/pronunciation_courses/', {page: 1});
      dispatch(receivedPronunciationCourses(response));
    } catch (err) {
      console.log('redux/courses 22', err);
    }
  };
};

export const actions = {
  receivedPronunciationCourses,
  fetchPronunciationCoursesAsync,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [RECEIVED_PRONUNCIATION_COURSES]: (state, {payload}) => {
    return payload;
  },
}, {docs: []});
