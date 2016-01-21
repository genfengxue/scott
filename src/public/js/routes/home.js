import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import CoreLayout from '../views/CoreLayout';
import LessonsView from '../views/LessonsView';
import CoursesView from '../views/CoursesView';
import ListenView from '../views/ListenView';
import TranslateView from '../views/TranslateView';
// import NotFoundView from '../views/NotFoundView/NotFoundView';
//     <Route path='/404' component={NotFoundView} />

export default (
  <Route path='/' component={CoreLayout}>
    <IndexRoute component={CoursesView} />
    <Route path='/home/courses/:courseNo' component={LessonsView} />
    <Route path='/home/listen/:lessonNo' component={ListenView} />
    <Route path='/home/translate/:lessonNo' component={TranslateView} />
    <Redirect from='*' to='/404' />
  </Route>
);
