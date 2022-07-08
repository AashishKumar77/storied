import React from "react";

// Components
import NodeForm from "../NodeForm";

// Local Components
import { CardMenu, CardSubMenu } from "./CardMenu";
import MyPopover from "./MyPopover";

const GetPopOver = ({ popId, open, anchorEl, handleClose, type, ...props }) => {
    const localScale = Number(localStorage.getItem("scaleval"));
    const scale = localScale <= 0.50 ? 0.50 : localScale;

    if(open){
        return (
            <MyPopover
                id={popId}
                open={open}
                anchorEl={anchorEl}
                handleClose={handleClose}
                type={type}
                scale={scale}
                content={<PopperContent type={type} {...props}/>}
            />
        )
    }else{
        return null;
    }
}

const PopperContent = ({ nextGen, subMenu, ...props }) => {
    if(nextGen) return <NodeForm {...props}/>
    else if(subMenu) return <CardSubMenu {...props}/>
    else return <CardMenu {...props}/>
}

export default GetPopOver;