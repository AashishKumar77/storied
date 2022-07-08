import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Msal
import { PublicClientApplication } from "@azure/msal-browser";
import { protectedResources, msalConfigForLogin } from "../../authConfig";

// Services
import { getAccessToken, setAccessToken, getUserFlow, removeCookies } from '../../services';

const BASE_URL = process.env.REACT_APP_API;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

const getCustomHeader = () => {
    const accessToken = getAccessToken();
    const bearer = `Bearer ${accessToken}`;
    const Authorization = ("Authorization", bearer);
    return {
        "wa-clientId": CLIENT_ID,
        "wa-requestId": uuidv4(),
        Authorization
    };
}

export const getApiCancelToken = () => {
    return axios.CancelToken.source();
}

export const isCancel = (err) => {
    return axios.isCancel(err);
}

export const refreshToken = () => {
    return new Promise((resolve) => {
        const instance = new PublicClientApplication(msalConfigForLogin);
        const account = instance.getAllAccounts()[0];
        if (account) {
            instance.acquireTokenSilent({
                scopes: protectedResources.apiStoried.scopes,
                account
            }).then((response) => {
                resolve(response.accessToken);
            }).catch((error) => {
                if(error) {
                    removeCookies();
                    instance.logoutRedirect({ postLogoutRedirectUri: "/" })
                }
                resolve(error);
            })
        }
    })
}

export const apiRequest = (method, url, data, onUploadProgress, source, headers = false) => {


    axios.interceptors.response.use(null, (error) => {
        let userFlow = getUserFlow();
        const instance = new PublicClientApplication(msalConfigForLogin);
        if (error.config && error.response && error.response.status === 401 && userFlow) {
            return refreshToken().then((token) => {
                setAccessToken(token);
                const bearer = `Bearer ${token}`;
                const Authorization = ("Authorization", bearer);
                error.config.headers = {
                    "wa-clientId": CLIENT_ID,
                    "wa-requestId": uuidv4(),
                    Authorization,
                    "content-type": "application/json",
                }
                return axios.request(error.config);
            });
        }
        if(!userFlow) {
            removeCookies();
            instance.logoutRedirect({ postLogoutRedirectUri: "/" })
        }

        return Promise.reject(error);
    });

    const sourceJSON = source ? {
        cancelToken: source.token
    } : {}

    if (headers && headers instanceof Object && !Array.isArray(headers)) {
        headers = {
            ...getCustomHeader(),
            ...headers
        }
    } else {
        headers = getCustomHeader()
    }

    return axios({
        method,
        url: `${BASE_URL}/api/${url}`,
        headers,
        data,
        ...sourceJSON,
        onUploadProgress: function (progressEvent) {
            if (onUploadProgress) onUploadProgress(progressEvent)
        },
    })
}