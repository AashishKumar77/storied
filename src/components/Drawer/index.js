import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Typography from "../Typography";
import Icon from "../Icon";
import "./index.css";
import { Field, Formik } from "formik";
import SearchPeople from "../SearchPeople";
import { TextField } from "@material-ui/core";
import TreePersonOptions from "./TreePersonOptions";

const useStyles = makeStyles({
  mainRoot: {
    "& .MuiBackdrop-root": {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    }
  },
  paper: {
    width: "320px"
  }
});

const MyDrawer = ({
  open,
  handleClose,
  title,
  subTitle,
  options,
  handleSelect
}) => {
  const classes = useStyles();
  let inputRef;
  const [showOption, setShowOption] = useState(false);


  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.focus();
      }, 1000);
    }
  }, [open]);

  useEffect(() => {
    let timer = setTimeout(() => {
      setShowOption(true);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  });

  return (
    <div className="search-drawer">
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        classes={{ root: classes.mainRoot, paper: classes.paper, }}
      >
        <div className="relative pt-6 pb-5 pl-6 pr-16">
          <div className="drawer-close">
            <Icon type="delete" handleClick={handleClose} />
          </div>
          <div className="drawer-title">
            <Typography text="secondary" weight="bold" size={24}>
              {title}
            </Typography>
          </div>
          <div className="leading-tight">
            <Typography text="secondary" weight="regular" size={12}>
              {subTitle}
            </Typography>
          </div>
        </div>
        <div className="relative search-box-wrapper">
          <Formik
            initialValues={{
              search: {}
            }}
            enableReinitialize={true}
          >
            <Field
              name="search"
              component={SearchPeople}
              placeholder={"Search"}
              freeSolo={true}
              open={showOption}
              type={"drawer"}
              closeIconDisable={false}
              highlight={true}
              renderInput={params =>
                <div className="relative search-input">
                  <div className="search-input-inner">
                    <div className="search-icon">
                      <Icon type="search" color="default" />
                    </div>
                    <TextField
                      inputRef={(input) => {
                        inputRef = input;
                      }}
                      {...params}
                      placeholder={"Search"}
                      variant="outlined"
                    />
                  </div>
                </div>
              }
              options={options}
              renderOption={(option, { inputValue }) => {
                return <TreePersonOptions option={option} inputValue={inputValue} />
              }}
              selectPeople={({ id }) => id ? handleSelect(id) : null}
            />
          </Formik>
        </div>
      </Drawer>
    </div>
  );
};

export default MyDrawer;
