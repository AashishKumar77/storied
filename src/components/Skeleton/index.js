import React from 'react';
import PropTypes from "prop-types";
import Skeleton from '@material-ui/lab/Skeleton';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    background: "#EFEFF0",
    marginLeft:"12px"
  }
})

const MySkeleton = ({ classes, variant, animation, width,height }) => {
  let skeleton=(
    <Skeleton classes={{ root: classes.root }} variant={variant} animation={animation} width={width}  />
  )
  if(height){
    skeleton=(
      <Skeleton classes={{ root: classes.root }} variant={variant} animation={animation} width={width} height={height} />
    )
  }
  return skeleton;
}

MySkeleton.propTypes = {
  variant: PropTypes.oneOf(["circular", "rect", "text", "string"]),
  width: PropTypes.oneOf(["100%", "75%", "50%", "65%"]),
  animation: PropTypes.oneOf(["wave", "pulse", "false"])
};

MySkeleton.defaultProps = {  
  variant: "rect",
  animation: "wave",
  width:"65%",
 
}

export default withStyles(styles)(MySkeleton);