import React,{ useEffect } from "react";
import { MsalProvider } from "@azure/msal-react";
import { reactPlugin } from "./AppInsights";
import { AppInsightsErrorBoundary } from "@microsoft/applicationinsights-react-js";
import './App.css';

// Auth
import ErrorWrapper from "./ErrorWrapper";
import ErrorBoundaryComponent from "./components/ErrorBoundaryComponent";

// Redux setup
import { Provider } from "react-redux";
import store from "./redux/store";

const App = ({ instance }) => {

  useEffect(() => {
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    }
  }, [])

  const handlePopState = () => {
    const simplePopOver = document.getElementById("simple-popover")
    if(simplePopOver) simplePopOver.remove();
  }

  return (
    <AppInsightsErrorBoundary onError={() => <ErrorWrapper appErrorState />} appInsights={reactPlugin}>
    <MsalProvider instance={instance}>
      <Provider store={store}>
        <ErrorWrapper />
      </Provider>
    </MsalProvider>
    </AppInsightsErrorBoundary>
  )
}

export default App;
