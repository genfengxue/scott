import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';
import unionBy from 'lodash/unionBy';

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVED_PRONUNCIATION_COURSES = 'RECEIVED_PRONUNCIATION_COURSES';

// ------------------------------------
// Actions
// ------------------------------------
export const receivedPronunciationCourses = createAction(RECEIVED_PRONUNCIATION_COURSES, (payload) => payload)

export const actions = {
  receivedPronunciationCourses,
  fetchPronunciationCoursesAsync,
};

export const fetchPronunciationCoursesAsync = () => {
  return async (dispatch) => {
    try {
      const response = await ajax.get('/api/courses/', {page: 1});
      dispatch(receivedPronunciationCourses(response));
    } catch (err) {
      console.log('redux/courses 22', err);
    }
  };
}


// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [RECEIVED_PRONUNCIATION_COURSES]: (state, {payload}) => {
    return payload;
  }
}, {docs: []});


