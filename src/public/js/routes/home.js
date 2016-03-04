import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import CoreLayout from '../views/CoreLayout';
import LessonsView from '../views/LessonsView';
import CoursesView from '../views/CoursesView';
import SkillsView from '../views/SkillsView';
import ListenView from '../views/ListenView';
import TranslateView from '../views/TranslateView';
import TempPronunciationView from '../views/TempPronunciationView';
import TranslateQuizView from '../views/TranslateQuizView';
import WarmView from '../views/WarmView';
import HomeworkView from '../views/HomeworkView';

// import NotFoundView from '../views/NotFoundView/NotFoundView';
//     <Route path='/404' component={NotFoundView} />

export default (
  <Route path="/" component={CoreLayout}>
    <IndexRoute component={SkillsView} />
    <Route path="/home/courses/" component={CoursesView} />
    <Route path="/home/pronunciations/" component={TempPronunciationView} />
    <Route path="/home/courses/:courseNo/lessons/:lessonNo/quiz/" component={TranslateQuizView} />
    <Route path="/home/courses/:courseNo" component={LessonsView} />
    <Route path="/home/homeworks/:homeworkId" component={HomeworkView} />
    <Route path="/home/courses/:courseNo/lessons/:lessonNo/warm/" component={WarmView} />
    <Route path="/home/courses/:courseNo/lessons/:lessonNo/listen/:sentenceNo" component={ListenView} />
    <Route path="/home/courses/:courseNo/lessons/:lessonNo/translate/:sentenceNo" component={TranslateView} />
    <Redirect from="*" to="/" />
  </Route>
);
