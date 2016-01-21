import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';
import unionBy from 'lodash/unionBy';
// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVED_LESSONS = 'RECEIVED_LESSONS';
export const RECEIVED_MORE_LESSONS = 'RECEIVED_MORE_LESSONS';
const pageSize = 20;
// ------------------------------------
// Actions
// ------------------------------------
export const receivedLessons = createAction(RECEIVED_LESSONS, (payload) => payload);
export const receivedMoreLessons = createAction(RECEIVED_MORE_LESSONS, (payload) => payload);

export const fetchLessonsAsync = (courseNo) => {
  return async (dispatch) => {
    const response = await ajax.get('/api/lessons/', {page: 1, courseNo});
    dispatch(receivedLessons(response));
  };
};

export const fetchMoreLessonsAsync = (page, courseNo) => {
  return async (dispatch, getState) => {
    try {
      const response = await ajax.get('/api/lessons/', {page, courseNo});
      dispatch(receivedMoreLessons(response));
    } catch(err) {
      console.log(err);
      // dispatch(receivedMoreLessons([]));
    }
  };
};

export const actions = {
  receivedLessons,
  receivedMoreLessons,
  fetchLessonsAsync,
  fetchMoreLessonsAsync,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [RECEIVED_LESSONS]: (state, {payload}) => {
    return payload;
  },
  [RECEIVED_MORE_LESSONS]: (state, {payload}) => {
    const {docs, total} = payload;
    state.total = total;
    state.docs = unionBy(state.docs, docs, '_id');
    return Object.assign({}, state);
  },
}, {docs: []});
