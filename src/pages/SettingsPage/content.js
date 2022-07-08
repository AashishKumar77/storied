import React from "react";

//Components
import Profile from './profile';
import Trees from "./trees";
import Billing from "./billing";
import Privacy from "./privacy";
import Notifications from "./notifications";

const Content = ({ tab, ...props }) => {
    const getTabs = () => {
        switch (tab) {

            case 2:
                return <Trees  />

            case 3 : 
            return <Billing />

            case 4 :
                return <Privacy />
            
            case 5: 
            return <Notifications />
            case 1:
            default:
                return (
                    <>
                         <Profile {...props} />
                    </>
                )
        }
    }

    return getTabs();

}

export default Content;