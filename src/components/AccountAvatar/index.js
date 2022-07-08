import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { grey, orange, blue, purple } from "@material-ui/core/colors";

const colors = [grey, orange, blue, purple];
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: 32,
    height: 32,
    "& > *": {
      margin: 0,
    },
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  grey: (props) => {
    return {
      color: theme.palette.getContrastText(grey[900]),
      backgroundColor: props.bgColorCode ? colors[props.bgColorCode][400] : grey[900],
      width: theme.spacing(4),
      height: theme.spacing(4),
      fontSize: props.likedPersons && "12px",
    };
  },
}));

const AccountAvatar = ({ avatarName, imgSrc, ...props }) => {
  const classes = useStyles(props);

  return <div className="avtar-circle-medium">{imgSrc ? <Avatar src={imgSrc} className={classes.small} /> : <Avatar className={classes.grey}>{avatarName.toUpperCase()}</Avatar>}</div>;
};

export default AccountAvatar;
