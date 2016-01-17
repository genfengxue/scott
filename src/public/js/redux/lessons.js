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

export const fetchLessonsAsync = () => {
  return async (dispatch) => {
    const response = await ajax.get('/api/lessons/', {page: 0});
    dispatch(receivedLessons(response.results));
  };
};

export const fetchMoreLessonsAsync = (index) => {
  return async (dispatch, getState) => {
    try {
      const response = await ajax.get('/api/lessons/', {page: index});
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
    const {results, count} = payload;
    state.count = count;
    state.results = unionBy(state.results, results, 'id');
    return Object.assign({}, state);
  },
}, {
  results: [
    {id: 1, name: 'abc'}, {id: 2, name: 'hello world'},
    {id: 3, name: 'abc'}, {id: 4, name: 'hello world'},
    {id: 5, name: 'abc'}, {id: 6, name: 'hello world'},
    {id: 7, name: 'abc'}, {id: 8, name: 'hello world'}
  ],
  count: 8,
});
