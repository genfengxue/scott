import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import CoreLayout from '../views/CoreLayout';
import LessonsView from '../views/LessonsView';
import CoursesView from '../views/CoursesView';
import PronunciationCoursesView from '../views/PronunciationCoursesView';
import PronunciationLessonsView from '../views/PronunciationLessonsView';
import PronunciationLessonActivityView from '../views/PronunciationLessonActivityView';
import PronunciationHomeworkView from '../views/PronunciationHomeworkView';
import SkillsView from '../views/SkillsView';
import ListenView from '../views/ListenView';
import TranslateView from '../views/TranslateView';
import TempPronunciationView from '../views/TempPronunciationView';
import DoingHomeworkView from '../views/DoingHomeworkView';
import WarmView from '../views/WarmView';
import HomeworkView from '../views/HomeworkView';
import DoingNewhomeworkView from '../views/DoingNewhomeworkView';

// import NotFoundView from '../views/NotFoundView/NotFoundView';
//     <Route path='/404' component={NotFoundView} />

export default (
  <Route path="/" component={CoreLayout}>
    <IndexRoute component={SkillsView} />
    <Route path="/home/courses/" component={CoursesView} />
    <Route path="/home/pronunciation_courses/" component={PronunciationCoursesView} />
    <Route path="/home/pronunciation_courses/:courseNo/lessons/" component={PronunciationLessonsView} />
    <Route path="/home/pronunciation_courses/:courseNo/lessons/:lessonNo" component={PronunciationLessonActivityView} />
    <Route path="/home/pronunciation_courses/:courseNo/lessons/:lessonNo/:activityIndex" component={PronunciationLessonActivityView} />
    <Route path="/home/pronunciation_homeworks/:pronunciationHomeworkId" component={PronunciationHomeworkView} />
    <Route path="/home/pronunciations/" component={TempPronunciationView} />
    <Route path="/home/courses/:courseNo/lessons/:lessonNo/quiz/" component={DoingHomeworkView} />
    <Route path="/home/courses/:courseNo/lessons/:lessonNo/newhomework/" component={DoingNewhomeworkView} />
    <Route path="/home/courses/:courseNo" component={LessonsView} />
    <Route path="/home/homeworks/:homeworkId" component={HomeworkView} />
    <Route path="/home/courses/:courseNo/lessons/:lessonNo/warm/" component={WarmView} />
    <Route path="/home/courses/:courseNo/lessons/:lessonNo/listen/:sentenceNo" component={ListenView} />
    <Route path="/home/courses/:courseNo/lessons/:lessonNo/translate/:sentenceNo" component={TranslateView} />
    <Redirect from="*" to="/" />
  </Route>
);
