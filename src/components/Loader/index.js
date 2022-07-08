import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import SpinnerImg from "../../assets/images/spinner.gif";
const styles = () => ({
  default: {
    color: "#FAFAFA",
  },
  primary: {
    color: "#295DA1",
  },
  secondary: {
    color: "#212122",
  },
  danger: {
    color: "#FC4040",
  },
  indeterminate: {
    animationDuration: "550ms",
  },
});
const Loader = ({ classes, color, spinner, ...props }) => {
  const getLoaderColor = () => {
    switch (color) {
      case "default":
        return classes.default;
      case "secondary":
        return classes.secondary;
      case "danger":
        return classes.danger;
      case "primary":
      default:
        return classes.primary;
    }
  };
  const loaderColor = getLoaderColor();
  return (
    <div className="h-full flex justify-center items-center">
      {spinner ? (
        <CircularProgress
          color="primary"
          disableShrink
          classes={{
            root: loaderColor,
            indeterminate: classes.indeterminate,
          }}
          {...props}
        />
      ) : (
        <img src={SpinnerImg} alt="storied" className="w-10 h-10" />
      )}
    </div>
  );
};
Loader.propTypes = {
  color: PropTypes.oneOf(["default", "primary", "secondary", "danger"]),
  spinner: PropTypes.bool,
};
Loader.defaultProps = {
  color: "primary",
  spinner: false,
};
export default withStyles(styles)(Loader);
