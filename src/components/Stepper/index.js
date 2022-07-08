import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { MobileStepper } from "@material-ui/core";
import "./index.css";

// Image
import treeImage from "./treeImage.png";

const useStyles = makeStyles({
  startTreeWrapper: {
    maxWidth: (props) => {
      return props?.width ? 640 : 600;
    },
    height: 560,
    background: "#FFF",
    margin: 0,
    position: "relative",
    zIndex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  root: {
    position: "absolute",
    top: 32,
    left: 32,
    background: "#FFF",
  },
  dot: {
    width: 8,
    height: 8,
    background: "#EFEFF0",
    borderRadius: 20,
  },
  dotActive: {
    background: "#FC4040",
  },
  leftPart: {
    padding: 40,
    paddingTop: 72,
    paddingBottom: 22,
    width: 400,
    position: "relative",
    height: 560,
  },
});

const MyStepper = ({ step, content, ...props }) => {
  const classes = useStyles(props);
  return (
    <div className={classes.startTreeWrapper}>
      <MobileStepper
        variant="dots"
        steps={3}
        position="static"
        activeStep={step}
        classes={{
          root: classes.root,
          dot: classes.dot,
          dotActive: classes.dotActive,
        }}
      />
      <div className="start-tree-content">
        <div className={classes.leftPart}>{content}</div>
        <div className="rightImg hidden sml:block">
          <img
            className={classes.rightPart}
            src={treeImage}
            alt="treeImage"
            width={200}
            height={560}
          />
        </div>
      </div>
    </div>
  );
};

export default MyStepper;
