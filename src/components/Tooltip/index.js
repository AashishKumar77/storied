import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles({
  tooltip: {
    background: props => props.background || "#212122",
    fontSize: props => props.fontSize || "14px",
    color: props => props.color || "#FFF",
    padding: props => props.padding || 8,
    fontWeight: props => props.fontWeight || 600,
    width: props => props.width || "100%",
    height: props => props.height || "100%",
    border: props => props.border || "none",
  },
  arrow: {
    color: props => props.background || "#212122",
  },
  popper: {
    top: 0,
    left: 0,
    position: "absolute"
  }
});

const MyTooltip = ({ children, type, open, arrow, placement, title, ...props }) => {

    const classes = useStyles(props);

    const [showTooltip, setShowTooltip] = useState(false);

    const tid = useMemo(() => (uuidv4()), []);

    const mouseEnterHandler = useCallback((e) => {
        if ((e.target.offsetWidth !== e.target.scrollWidth) && !showTooltip) {
            setShowTooltip(true);
        }
        else if ((e.target.offsetWidth === e.target.scrollWidth) && showTooltip) {
            setShowTooltip(false);
        }
    }, [showTooltip, setShowTooltip])

    const mouseLeaveHandler = () => {
      setShowTooltip(false);
    }

    switch(type){
      case "controlled":
        return (
          <Tooltip 
              id={tid}
              title={title} 
              arrow={arrow}
              placement={placement}
              open={open}
              classes={{
                  tooltip: classes.tooltip,
                  tooltipArrow: classes.tooltipArrow,
                  arrow: classes.arrow,
                  popper: classes.popper
              }}
          >
            {children}
          </Tooltip>
        )
      
      case "ellipses":
        return (
          <div data-tip data-for={tid} onMouseEnter={mouseEnterHandler} onMouseLeave={mouseLeaveHandler}>
            <Tooltip 
              id={tid}
              title={title} 
              arrow={arrow}
              placement={placement}
              open={showTooltip}
              classes={{
                  tooltip: classes.tooltip,
                  tooltipArrow: classes.tooltipArrow,
                  arrow: classes.arrow,
                  popper: classes.popper
              }}
              className="tooltip-content"
              >
                {children}
              </Tooltip>
          </div>
        )

      default: 
        return (
          <Tooltip 
              id={tid}
              title={title} 
              arrow={arrow}
              placement={placement}
              classes={{
                  tooltip: classes.tooltip,
                  tooltipArrow: classes.tooltipArrow,
                  arrow: classes.arrow,
                  popper: classes.popper
              }}
          >
            {children}
          </Tooltip>
        )
    }
}

MyTooltip.propTypes = {
    id: PropTypes.string,
    type: PropTypes.oneOf(["controlled", "hover", "ellipses"]),
    open: PropTypes.bool,
    arrow: PropTypes.bool,
    placement: PropTypes.oneOf(["bottom-end", "bottom-start", "bottom", "left-end", "left-start", "left", "right-end", "right-start", "right", "top-end", "top-start", "top"]),
};

MyTooltip.defaultProps = {
    id: "tooltip",
    type: "hover",
    open: false,
    arrow: true,
    placement: "bottom",
    title: "",
}

export default MyTooltip;