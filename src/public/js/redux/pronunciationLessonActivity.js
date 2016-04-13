import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVED_PRONUNCIATION_LESSONS_ACTIVITY = 'RECEIVED_PRONUNCIATION_LESSONS_ACTIVITY';

// ------------------------------------
// Actions
// ------------------------------------
export const receviedPronunciationLessonsActivity = createAction(RECEIVED_PRONUNCIATION_LESSONS_ACTIVITY, (payload) => payload);

export const fetchPronunciationLessonsActivityAsync = () => {
  return async (dispatch) => {
    try {
      const response = await ajax.get('api/pronunciation_courses/1/lessons/1', {page: 1});
      dispatch(receviedPronunciationLessonsActivity(response));
    } catch (err) {
      console.log('fetch pronunciation lessons activity error');
    }
  }
}

export const actions = {
  receviedPronunciationLessonsActivity,
  fetchPronunciationLessonsActivityAsync,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [RECEIVED_PRONUNCIATION_LESSONS_ACTIVITY]: (state, {payload}) => {
    return payload;
  },
}, {docs: []});
