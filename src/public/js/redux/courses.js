import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';
import unionBy from 'lodash/unionBy';
// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVED_COURSES = 'RECEIVED_COURSES';
export const RECEIVED_MORE_COURSES = 'RECEIVED_MORE_COURSES';

// ------------------------------------
// Actions
// ------------------------------------
export const receivedCourses = createAction(RECEIVED_COURSES, (payload) => payload);
export const receivedMoreCourses = createAction(RECEIVED_MORE_COURSES, (payload) => payload);

export const fetchCoursesAsync = () => {
  return async (dispatch) => {
    try {
      const response = await ajax.get('/api/courses/', {page: 1});
      dispatch(receivedCourses(response));
    } catch (err) {
      console.log('redux/courses 22', err);
    }
  };
};

export const fetchMoreCoursesAsync = (page) => {
  return async (dispatch) => {
    try {
      const response = await ajax.get('/api/courses/', {page});
      dispatch(receivedMoreCourses(response));
    } catch (err) {
      console.log('redux/courses 33', err);
    }
  };
};

export const actions = {
  receivedCourses,
  receivedMoreCourses,
  fetchCoursesAsync,
  fetchMoreCoursesAsync,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [RECEIVED_COURSES]: (state, {payload}) => {
    return payload;
  },
  [RECEIVED_MORE_COURSES]: (state, {payload}) => {
    const {docs, total} = payload;
    state.total = total;
    state.docs = unionBy(state.docs, docs, '_id');
    return Object.assign({}, state);
  },
}, {docs: []});
