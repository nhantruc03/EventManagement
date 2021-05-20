import React from "react";
import { NativeRouter, Route, Link } from "react-router-native";
import { Redirect } from "react-router";
import auth from "./auth";

export const SecureRouteAdmin = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        auth.isAuthenticatedAdmin() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};
