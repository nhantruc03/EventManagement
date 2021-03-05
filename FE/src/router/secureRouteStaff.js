import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./auth";

export const SecureRouteStaff = ({ component: Component, layout: Layout, ...rest }) => {
    return (
        <Route {...rest} render={data => auth.isAuthenticatedStaff() ? (
            <Layout><Component {...data}></Component></Layout>) :
            (<Redirect to={{ pathname: '/login' }}></Redirect>)}></Route>
    );
};
