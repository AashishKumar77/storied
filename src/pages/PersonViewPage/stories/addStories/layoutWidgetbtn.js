import React from "react";
import {getWidgetLabel} from "./../../../../utils"
import MyPopper from '../../../../components/MyPopper'

const LayoutWidgetbtn = ({ handleChange ,widgetShape}) => {
  const [anchorEl, setAnchorEl] = React.useState({component: null, text: ""});
  const mouseLeave = React.useRef(true);
  return (
    <div className="layout-switch-widget" onMouseLeave={(e)=>{
      if( mouseLeave.current ) {
        setAnchorEl({component: null, text:""})
        let top = document.body.scrollHeight || document.documentElement.scrollHeight
          window.scrollTo({
            top: top-100,
            behavior: 'smooth'
          });
      }
      }} >
      {Object.keys(widgetShape).map((item, index) => {
        return (
            <button 
              key={index}
              type="button" 
              className={widgetShape[item]} 
              onClick={()=>handleChange(item)} 
              onMouseEnter={(e)=>setAnchorEl({component: e.currentTarget, text:getWidgetLabel(item)})}></button>
        );
      })}
      <MyPopper open={Boolean(anchorEl.component)} anchorEl={anchorEl.component} setMouseLeave = {mouseLeave}>
            {anchorEl.text}
      </MyPopper>
    </div>
  );
};

export default LayoutWidgetbtn;