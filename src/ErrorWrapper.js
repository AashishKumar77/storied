import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

//Components
import ErrorBoundaryComponent from "./components/ErrorBoundaryComponent";
import MainPage from "./MainPage";

const ErrorWrapper = ({ appErrorState }) => {
  return (
    <div className="w-full h-full">
      <Router>
        <Switch>
          {appErrorState && <Route exact path="/error" component={ErrorBoundaryComponent} />}
          <Route render={(props) => (!appErrorState ? <MainPage {...props} /> : <Redirect to="/error" />)} />
        </Switch>
      </Router>
    </div>
  );
};

export default ErrorWrapper;
