import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// Msal imports
import { MsalAuthenticationTemplate, useMsal, useAccount } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest, protectedResources, b2cPolicies } from "./authConfig";
import { setAccessToken, setOwner, getUserFlow, removeCookies } from './services';

// Components
import Loader from "./components/Loader";
import ProtectedRoutes from "./pages/ProtectedRoutes";

//Actions
import { getUserAccount } from "./redux/actions/user";


const ProtectedPage = ({ dispatchGetUserAccount }) => {
  const { instance, accounts, inProgress } = useMsal();
  const authRequest = { ...loginRequest };
  const account = useAccount(accounts[0] || {});
  const userFlow = getUserFlow();

  useEffect(() => {
    async function getToken(){
    let accessToken, signInAccount, tokenClaims;
    if (userFlow && account && inProgress === "none") {
      const response = await getTokenFromInstance(instance, account);
      if(response) {
        accessToken = response.accessToken;
        signInAccount = response.account;
        tokenClaims = signInAccount.idTokenClaims;
        const id = tokenClaims.oid;
        setAccessToken(accessToken);
        setOwner(id);
        dispatchGetUserAccount(id);
      }
    }
  }
  getToken();
  }, [instance, account, inProgress, dispatchGetUserAccount, userFlow]);

  const getTokenFromInstance = (receiveInstance, receiveAccount) => {
    return new Promise((resolve) => {
      receiveInstance.acquireTokenSilent({
        scopes: protectedResources.apiStoried.scopes,
        account: receiveAccount
      }).then((response) => {
        resolve(response);
      })
    })
  }

  const handleLogout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: "/" })
    removeCookies();
}


  return (
    <>  { userFlow && (
        <MsalAuthenticationTemplate
          interactionType={InteractionType.Redirect}
          authenticationRequest={authRequest}
          loadingComponent={Loader}
        >
          {account && account.idTokenClaims && account.idTokenClaims["tfp"] !== b2cPolicies.names.forgotPassword ?
            <ProtectedRoutes /> : <Loader />}
        </MsalAuthenticationTemplate>
        )}

        { !userFlow && handleLogout()}

    </>
  )
}

ProtectedPage.propTypes = {
  user: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchGetUserAccount: (id) => dispatch(getUserAccount(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedPage);