import React,{ useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { EventType, InteractionType } from "@azure/msal-browser";
import { b2cPolicies } from "./authConfig";
import { getUserFlow } from "./services";

//Components
import Main from "./pages";


const MainPage = () => {
    /**
     * useMsal is hook that returns the PublicClientApplication instance, 
     * an array of all accounts currently signed in and an inProgress value 
     * that tells you what msal is currently doing.
     */
    const { instance } = useMsal();
  
    /**
     * Using the event API, you can register an event callback that will do something when an event is emitted. 
     * When registering an event callback in a react component you will need to make sure you do 2 things.
     * 1) The callback is registered only once
     * 2) The callback is unregistered before the component unmounts.
     */
    useEffect(() => {
      const callbackId = instance.addEventCallback((event) => {
        let userflow = getUserFlow();
        if (event.eventType === EventType.LOGIN_FAILURE) {
          if (event.error && event.error.errorMessage.indexOf("AADB2C90118") > -1) {
            if (event.interactionType === InteractionType.Redirect) {
              instance.loginRedirect(b2cPolicies.authorities.forgotPassword);
            } else if (event.interactionType === InteractionType.Popup) {
              instance.loginPopup(b2cPolicies.authorities.forgotPassword)
                .catch(e => {
                  return;
                });
            }
          }
          if(event.error && userflow !== "signUp" && event.error.errorMessage.indexOf("AADB2C90091") > -1){
            if (event.interactionType === InteractionType.Redirect) {
              instance.loginRedirect(b2cPolicies.authorities.signUpSignInUp);
            }
          }
        }
  
        if (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
          if (event.payload) {
            /**
             * We need to reject id tokens that were not issued with the default sign-in policy.
             * "acr" claim in the token tells us what policy is used (NOTE: for new policies (v2.0), use "tfp" instead of "acr").
             */
            if (event.payload.account.idTokenClaims["tfp"] === b2cPolicies.names.forgotPassword || event.payload.account.idTokenClaims["tfp"] === b2cPolicies.names.editProfile) {
              return instance.logout();
            }
          }
        }
  
        if (event.eventType === EventType.ACQUIRE_TOKEN_FAILURE) {
          return instance.logout();
        }
        
      });
  
      return () => {
        if (callbackId) {
          instance.removeEventCallback(callbackId);
        }
      };
    }, [instance]);
  
    return (
      <Main />
    )
  }

  export default MainPage;