import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';

// ------------------------------------
// Constants
// ------------------------------------
export const PRONUNCIATION_HOMEWORK_ERRORS = 'PRONUNCIATION_HOMEWORK_ERRORS';
export const PRONUNCIATION_HOMEWORK_INIT = 'PRONUNCIATION_HOMEWORK_INIT';
export const RECEIVED_SINGLE_PRONUNCIATION_HOMEWORK = 'RECEIVED_SINGLE_PRONUNCIATION_HOMEWORK';
export const TOGGLE_PLAY = 'TOGGLE_PLAY';

// ------------------------------------
// Actions
// ------------------------------------
export const displayErrors = createAction(PRONUNCIATION_HOMEWORK_ERRORS, (payload) => payload);
export const pronunciationHomeworkInit = createAction(PRONUNCIATION_HOMEWORK_INIT);
export const receivedSinglePronunciationHomework = createAction(RECEIVED_SINGLE_PRONUNCIATION_HOMEWORK, (payload) => payload);
export const togglePlay = createAction(TOGGLE_PLAY, (payload) => payload);
export const fetchSinglePronunciationHomeworkAsync = (pronunciationHomeworkId) => {
  return async (dispatch) => {
    try {
      const response = await ajax.get('/api/pronunciation_homeworks/' + pronunciationHomeworkId);
      dispatch(receivedSinglePronunciationHomework(response));
    } catch (err) {
      console.log('redux/pronunciationHomework 25', err);
    }
  };
};

export const actions = {
  displayErrors,
  pronunciationHomeworkInit,
  fetchSinglePronunciationHomeworkAsync,
  receivedSinglePronunciationHomework,
  togglePlay,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [PRONUNCIATION_HOMEWORK_ERRORS]: (state, {payload}) => {
    state.errors = payload;
    return Object.assign({}, state);
  },
  [PRONUNCIATION_HOMEWORK_INIT]: () => {
    return {errors: {}, playing: {}};
  },
  [RECEIVED_SINGLE_PRONUNCIATION_HOMEWORK]: (state, {payload}) => {
    return Object.assign(state, payload);
  },
  [TOGGLE_PLAY]: (state, {payload}) => {
    state.playing = payload;
    return Object.assign({}, state);
  },
}, {errors: {}, playing: {}});
