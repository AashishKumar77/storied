import React from "react";
import Icon from "../Icon";

const Actions = ({...props}) =>(
    <>
    <div className="absolute top-20 right-10" onClick={props?.handleDrawer}>
        <div id="btnsearch" className={`${props?.disable ? "icon-wrapper aim-icon search-disable" : "icon-wrapper aim-icon"}`}>
        
          <div className="absolute">
            <Icon type="search" id="search" background color="default" disabled = {`${props?.disable ? true : false}`} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 right-10">
        <div className="flex-column">
          <div className="two-icons-wrapper">
            <div id="btnhomePerson" className={`${props?.disable ? "group-icon home-disable" : "group-icon home-icon"}`}>
              <Icon type="home" id="homePerson" color="default" disabled = {`${props?.disable ? true : false}`} />
            </div>
            <div className="group-split" />
            <div id="btnreset" className={`${props?.disable ? "icon-wrapper aim-icon reset-disable" : "icon-wrapper aim-icon"}`}>
              <Icon type="aim" id="reset" color="default" disabled = {`${props?.disable ? true : false}`} />
            </div>

          </div>
          <div className="two-icons-wrapper">
            <div id="btnplus" className={`${props?.disable? "group-icon top-disable" : "group-icon top-icon"}`}>
              <Icon type="plus" id="plus" color="default" disabled = {`${props?.disable ? true : false}`} />
            </div>
            <div className="group-split" />
            <div id="btnminus" className={`${props?.disable? "group-icon bottom-disable" : "group-icon bottom-icon"}`}>
              <Icon type="minus" id="minus" color="default" disabled = {`${props?.disable ? true : false}`} />
            </div>
          </div>
        </div>
      </div>
      </>
)
export default Actions