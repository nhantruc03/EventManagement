import React from 'react';
import { Route } from 'react-router-dom';

export const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
    <Route {...rest} render={props => (
      <Layout><Component {...props}></Component></Layout>
    )}></Route>
  )