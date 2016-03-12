import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';

// ------------------------------------
// Constants
// ------------------------------------
export const WARM_ERRORS = 'WARM_ERRORS';
export const WARM_INIT = 'WARM_INIT';
export const RECEIVED_SINGLE_LESSON = 'RECEIVED_SINGLE_LESSON';

export const TOGGLE_REVIEW_MODAL = 'TOGGLE_REVIEW_MODAL';
export const TOGGLE_METHOD_MODAL = 'TOGGLE_METHOD_MODAL';
export const TOGGLE_FEEDBACK_MODAL = 'TOGGLE_FEEDBACK_MODAL';
export const TOGGLE_COLLECTION_MODAL = 'TOGGLE_COLLECTION_MODAL';
// ------------------------------------
// Actions
// ------------------------------------
export const displayErrors = createAction(WARM_ERRORS, (payload) => payload);
export const warmInit = createAction(WARM_INIT);
export const receivedSingleLesson = createAction(RECEIVED_SINGLE_LESSON, (payload) => payload);
export const fetchSingleLessonAsync = (courseNo, lessonNo) => {
  return async (dispatch) => {
    try {
      const response = await ajax.get('/api/lessons/' + courseNo + '/' + lessonNo);
      dispatch(receivedSingleLesson(response));
    } catch (err) {
      console.log(err);
    }
  };
};
export const toggleCollectionModal = createAction(TOGGLE_COLLECTION_MODAL, (payload) => payload);
export const toggleReviewModal = createAction(TOGGLE_REVIEW_MODAL, (payload) => payload);
export const toggleMethodModal = createAction(TOGGLE_METHOD_MODAL, (payload) => payload);
export const toggleFeedbackModal = createAction(TOGGLE_FEEDBACK_MODAL, (payload) => payload);

export const actions = {
  displayErrors,
  warmInit,
  fetchSingleLessonAsync,
  receivedSingleLesson,
  toggleCollectionModal,
  toggleReviewModal,
  toggleMethodModal,
  toggleFeedbackModal,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [WARM_ERRORS]: (state, {payload}) => {
    state.errors = payload;
    return Object.assign({}, state);
  },
  [WARM_INIT]: () => {
    return {errors: {}};
  },
  [RECEIVED_SINGLE_LESSON]: (state, {payload}) => {
    state.lesson = payload;
    return Object.assign({}, state);
  },
  [TOGGLE_COLLECTION_MODAL]: (state, {payload}) => {
    state.showCollectionModal = payload;
    return Object.assign({}, state);
  },
  [TOGGLE_REVIEW_MODAL]: (state, {payload}) => {
    state.showReviewModal = payload;
    return Object.assign({}, state);
  },
  [TOGGLE_METHOD_MODAL]: (state, {payload}) => {
    state.showMethodModal = payload;
    return Object.assign({}, state);
  },
  [TOGGLE_FEEDBACK_MODAL]: (state, {payload}) => {
    state.showFeedbackModal = payload;
    return Object.assign({}, state);
  },
}, {errors: {}});
