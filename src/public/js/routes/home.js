import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import CoreLayout from '../views/CoreLayout';
import HomeView from '../views/HomeView';
// import NotFoundView from '../views/NotFoundView/NotFoundView';
//     <Route path='/404' component={NotFoundView} />

export default (
  <Route path='/' component={CoreLayout}>
    <IndexRoute component={HomeView} />
    <Redirect from='*' to='/404' />
  </Route>
);
