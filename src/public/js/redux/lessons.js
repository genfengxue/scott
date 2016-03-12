import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';
import unionBy from 'lodash/unionBy';
// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVED_LESSONS = 'RECEIVED_LESSONS';
export const RECEIVED_MORE_LESSONS = 'RECEIVED_MORE_LESSONS';
// ------------------------------------
// Actions
// ------------------------------------
export const receivedLessons = createAction(RECEIVED_LESSONS, (payload) => payload);
export const receivedMoreLessons = createAction(RECEIVED_MORE_LESSONS, (payload) => payload);

export const fetchLessonsAsync = (courseNo, query) => {
  return async (dispatch) => {
    try {
      const response = await ajax.get('/api/lessons/', Object.assign({page: 1, courseNo}, query));
      dispatch(receivedLessons(response));
    } catch(err) {
      console.log(err);
    }
  };
};

export const fetchMoreLessonsAsync = (page, courseNo, query) => {
  return async (dispatch) => {
    try {
      const response = await ajax.get('/api/lessons/', Object.assign({page, courseNo}, query));
      dispatch(receivedMoreLessons(response));
    } catch (err) {
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
