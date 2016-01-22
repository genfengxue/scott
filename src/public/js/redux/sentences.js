import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';
import unionBy from 'lodash/unionBy';
// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVED_SENTENCES = 'RECEIVED_SENTENCES';
const pageSize = 20;
// ------------------------------------
// Actions
// ------------------------------------
export const receivedSentences = createAction(RECEIVED_SENTENCES, (payload) => payload);

export const fetchSentencesAsync = (courseNo, lessonNo) => {
  return async (dispatch) => {
    const response = await ajax.get('/api/sentences/', {page: 1, courseNo, lessonNo});
    dispatch(receivedSentences(response));
  };
};

export const actions = {
  receivedSentences,
  fetchSentencesAsync,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [RECEIVED_SENTENCES]: (state, {payload}) => {
    return payload;
  },
}, {docs: []});
