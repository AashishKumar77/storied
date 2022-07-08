import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  barColorPrimary: {
    background: "#204A82"
  },
  barColorSecondary: {
    background: "#94AED0"
  }
});

const ProgressBar = ({ progress }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LinearProgressWithLabel classes={classes} value={progress}/>
    </div>
  );
}

const LinearProgressWithLabel = ({ classes, value }) => {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress 
          variant="determinate" 
          value={value}
          classes={{
            barColorPrimary: classes.barColorPrimary,
            barColorSecondary: classes.barColorSecondary
          }}
        />
      </Box>
    </Box>
  );
}

ProgressBar.propTypes = {
  progress: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

ProgressBar.defaultProps = {    
  progress: 50
}

export default ProgressBar;