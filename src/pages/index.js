import React, { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { useMsal, useAccount } from "@azure/msal-react";
import { connect } from "react-redux";

// Components
import Loader from "../components/Loader";
import SnackbarComponent from "../components/Snackbar"
import ProtectedPage from "../ProtectedPage";

//Actions
import { clearAccess } from "../redux/actions/user";

//Services
import { getAccessCode, getAccessToken } from "../services";

const AccessPage = lazy(() => import('./AccessPage'));
const LoggedOutHomepage = lazy(() => import('./LoggedOutHomepage'));



const Main = ({
    user: { accessCodeInvalid, redirectToLogin },
    dispatchClearAccess
}) => {
    const { accounts, inProgress } = useMsal();
    const account = useAccount(accounts[0] || {});
    const [isAccessed, setIsAccessed]= useState(getAccessCode());
    const [isAccessToken, setIsAccessToken] = useState(getAccessToken());

    useEffect(() => {
        if (redirectToLogin) {
            setIsAccessed(true);
            dispatchClearAccess();
        }
    }, [accessCodeInvalid, dispatchClearAccess, redirectToLogin])

    useEffect(() => {
        if (account && inProgress == "none") {
            setIsAccessToken(true)
        }
    }, [account, inProgress]) 


    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader/></div>}>
            <div className="application-wrapper">
                <Router>
                    <Switch>
                        {!isAccessed && (<Route exact path="/" component={AccessPage} />)}
                        { isAccessed && !isAccessToken && (<Route exact path="/" component={LoggedOutHomepage} />)}
                        { isAccessed && isAccessToken && (<Route exact path="/" component={ProtectedPage} />)}
                        <Route
                            render={(props) =>
                                isAccessed && isAccessToken ? <ProtectedPage {...props} />  : <Redirect to="/" />
                            }
                        />
                    </Switch>
                </Router>
            </div>
            <SnackbarComponent />
        </Suspense>
    );
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchClearAccess: () => dispatch(clearAccess())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Main);
