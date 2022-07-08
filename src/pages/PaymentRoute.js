import React from "react";
import { Redirect, Route } from "react-router-dom";
import { getAccessToken, getIsPrivileged } from '../services';

const PaymentRoute = ({ component: Component, ...rest }) => {
  const accessToken = getAccessToken();

  return (
    <Route
      {...rest}
      render={(props) => {
        return (accessToken && !getIsPrivileged())? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/" }} />
        );
      }}
    />
  );
};

export default PaymentRoute;
