import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';

const useStyles = makeStyles({
  paper: {
    overflowX: "unset",
    overflowY: "unset",
    opacity: 1,
    background: "transparent",
    boxShadow: "none",
    transformOrigin:"0px 0px !important",
    transform: props => {
      return `scale(${props.scale}) !important`
    }
  }
});

export default function MyPopover({ id, open, anchorEl, handleClose, content, ...props }) {
  const classes = useStyles(props);

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      classes={{
        paper: classes.paper
      }}
    >
      {content}
    </Popover>
  );
}
