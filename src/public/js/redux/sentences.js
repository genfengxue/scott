import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVED_SENTENCES = 'RECEIVED_SENTENCES';

// ------------------------------------
// Actions
// ------------------------------------
export const receivedSentences = createAction(RECEIVED_SENTENCES, (payload) => payload);

export const fetchSentencesAsync = (courseNo, lessonNo) => {
  return async (dispatch) => {
    try {
      const response = await ajax.get('/api/sentences/', {page: 1, courseNo, lessonNo});
      dispatch(receivedSentences(response));
    } catch(err) {
      console.log(err);
    }
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
