import { LogLevel } from "@azure/msal-browser";

export const b2cPolicies = {
    names: {
        signUpSignInUp: process.env.REACT_APP_SIGNUPSIGNINUP,
        signUp: process.env.REACT_APP_SIGNUP,
        forgotPassword: process.env.REACT_APP_FORGOTPASSWORD,
        editProfile: process.env.REACT_APP_EDITPROFILE
    },
    authorities: {
        signUpSignInUp: {
            authority: `${process.env.REACT_APP_AUTHORITY}/${process.env.REACT_APP_SIGNUPSIGNINUP}`
        },
        signUp: {
            authority: `${process.env.REACT_APP_AUTHORITY}/${process.env.REACT_APP_SIGNUP}`
        },
        forgotPassword: {
            authority: `${process.env.REACT_APP_AUTHORITY}/${process.env.REACT_APP_FORGOTPASSWORD}`
        },
        editProfile: {
            authority: `${process.env.REACT_APP_AUTHORITY}/${process.env.REACT_APP_EDITPROFILE}`
        }
    },
    authorityDomain: process.env.REACT_APP_INSTANCE
}
/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */
export const msalConfigForSignUp = {
    auth: {
        clientId: process.env.REACT_APP_MSAL_ID, // This is the ONLY mandatory field that you need to supply.
        authority: b2cPolicies.authorities.signUp.authority, // Choose SUSI as your default authority.
        knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
        redirectUri: "/", // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
        postLogoutRedirectUri: "/", // Indicates the page to navigate after logout.
        navigateToLoginRequestUrl: true, // If "true", will navigate back to the original request location before processing the auth code response.
    },
    cache: {
        cacheLocation: "sessionStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        return;
                    case LogLevel.Info:
                        return;
                    case LogLevel.Verbose:
                        return;
                    case LogLevel.Warning:
                        return;
                    default:
                            // do nothing
                }
            }
        }
    }
};

/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */
export const msalConfigForLogin = {
    auth: {
        clientId: process.env.REACT_APP_MSAL_ID, // This is the ONLY mandatory field that you need to supply.
        authority: b2cPolicies.authorities.signUpSignInUp.authority, // Choose SUSI as your default authority.
        knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
        redirectUri: "/", // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
        postLogoutRedirectUri: "/", // Indicates the page to navigate after logout.
        navigateToLoginRequestUrl: true, // If "true", will navigate back to the original request location before processing the auth code response.
    },
    cache: {
        cacheLocation: "sessionStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
};


/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: [process.env.REACT_APP_SCOPE]
};
/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const protectedResources = {
    apiStoried: {
        // endpoint: "https://localhost:44332/api/trees/startup",
        scopes: [process.env.REACT_APP_SCOPE], // e.g. api://xxxxxx/access_as_user
    },
}