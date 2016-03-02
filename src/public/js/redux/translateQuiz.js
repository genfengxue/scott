import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';

// ------------------------------------
// Constants
// ------------------------------------
export const TRANSLATE_QUIZ_ERRORS = 'TRANSLATE_QUIZ_ERRORS';
export const TRANSLATE_QUIZ_INIT = 'TRANSLATE_QUIZ_INIT';
export const RECEIVED_SINGLE_LESSON = 'RECEIVED_SINGLE_LESSON';
export const TOGGLE_REVIEW_MODAL = 'TOGGLE_REVIEW_MODAL';
export const TOGGLE_METHOD_MODAL = 'TOGGLE_METHOD_MODAL';
export const TOGGLE_FEEDBACK_MODAL = 'TOGGLE_FEEDBACK_MODAL';
export const TOGGLE_COLLECTION_MODAL = 'TOGGLE_COLLECTION_MODAL';
export const BEGIN_TRANSLATE_QUIZ = 'BEGIN_TRANSLATE_QUIZ';
export const END_TRANSLATE_QUIZ = 'END_TRANSLATE_QUIZ';

// ------------------------------------
// Actions
// ------------------------------------
export const displayErrors = createAction(TRANSLATE_QUIZ_ERRORS, (payload) => payload);
export const translateQuizInit = createAction(TRANSLATE_QUIZ_INIT);
export const receivedSingleLesson = createAction(RECEIVED_SINGLE_LESSON, (payload) => payload);
export const fetchSingleLessonAsync = (courseNo, lessonNo) => {
  return async (dispatch) => {
    const response = await ajax.get('/api/lessons/' + courseNo + '/' + lessonNo);
    dispatch(receivedSingleLesson(response));
  };
};
export const toggleCollectionModal = createAction(TOGGLE_COLLECTION_MODAL, (payload) => payload);
export const toggleReviewModal = createAction(TOGGLE_REVIEW_MODAL, (payload) => payload);
export const toggleMethodModal = createAction(TOGGLE_METHOD_MODAL, (payload) => payload);
export const toggleFeedbackModal = createAction(TOGGLE_FEEDBACK_MODAL, (payload) => payload);
export const beginTranslateQuiz = createAction(BEGIN_TRANSLATE_QUIZ);
export const endTranslateQuiz = createAction(END_TRANSLATE_QUIZ);

export const actions = {
  displayErrors,
  translateQuizInit,
  fetchSingleLessonAsync,
  receivedSingleLesson,
  toggleCollectionModal,
  toggleReviewModal,
  toggleMethodModal,
  toggleFeedbackModal,
  beginTranslateQuiz,
  endTranslateQuiz,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [TRANSLATE_QUIZ_ERRORS]: (state, {payload}) => {
    state.errors = payload;
    return Object.assign({}, state);
  },
  [TRANSLATE_QUIZ_INIT]: () => {
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
  [BEGIN_TRANSLATE_QUIZ]: (state) => {
    state.quizOn = true;
    return Object.assign({}, state);
  },
  [END_TRANSLATE_QUIZ]: (state) => {
    state.quizOn = false;
    return Object.assign({}, state);
  },
}, {errors: {}});
