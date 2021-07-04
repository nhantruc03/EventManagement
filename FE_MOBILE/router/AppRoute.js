import React from 'react';
import { NativeRouter, Route, Link } from "react-router-native";


export const AppRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    <Component {...props}></Component>
  )}></Route>
)