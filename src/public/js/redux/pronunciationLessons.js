import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVED_PRONUNCIATION_LESSONS = 'RECEIVED_PRONUNCIATION_LESSONS';

// ------------------------------------
// Actions
// ------------------------------------
export const receivedPronunciationLessons = createAction(RECEIVED_PRONUNCIATION_LESSONS, (payload) => payload);

export const fetchPronunciationLessonsAsync = () => {
  return async (dispatch) => {
    try {
      const response = await ajax.get('api/pronunciation_courses/1/lessons', {page: 1});
      dispatch(receivedPronunciationLessons(response));
    } catch (err) {
      console.log('error');
    }
  };
};

export const actions = {
  receivedPronunciationLessons,
  fetchPronunciationLessonsAsync,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [RECEIVED_PRONUNCIATION_LESSONS]: (state, {payload}) => {
    return payload;
  },
}, {docs: []});
