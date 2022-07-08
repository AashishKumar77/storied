import React from "react";
import ReactDOM from "react-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfigForSignUp, msalConfigForLogin } from "./authConfig";
import { getUserFlow } from "./services"
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import { I18nextProvider } from "react-i18next";
import 'tailwindcss/tailwind.css'
import i18n from "./i18n";


const getMsalInstance = () => {
  let userFlow = getUserFlow();
  if( userFlow === "signUp" ){
    return new PublicClientApplication(msalConfigForSignUp)
  }
  else {
    return new PublicClientApplication(msalConfigForLogin)
  }
}

ReactDOM.render(  
    <I18nextProvider i18n={i18n}>
      <App instance={getMsalInstance()} />
    </I18nextProvider>
   , document.getElementById('root')
);

reportWebVitals();
