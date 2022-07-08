import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import ComboOptions from "./ComboOptions";
import { Field, Formik } from "formik";
import SearchPeople from "../SearchPeople";

// Components
import Typography from "../Typography";


let inputRef;

const ComboBox = ({
  id,
  init,
  label,
  placeholder,
  options,
  value,
  handleChange,
  handleSelect,
  ...props
}) => {

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (init) {
      let timer = setTimeout(() => {
        setOpen(true);
        inputRef.focus();
        props.changeInit(false);
      }, 500)

      return () => {
        clearTimeout(timer);
        props.changeInit(true);
      }
    }
  })

  const onChange = (newVal) => {
    handleSelect(null)
    setOpen(true);
    handleChange(newVal);
  }

  const onSelect = (event, newVal) => {
    setOpen(false);
    handleSelect(event, newVal);
  }

  return (
    <div className="home-person">
      <Typography size={14} tkey={label} />
       <Formik
            initialValues={{ search: {}
            }}
            enableReinitialize={true}
          >
            <Field
              name="search"
              component={SearchPeople}
              placeholder={"Search"}
              freeSolo={true}
              open={open}
              type="combobox"
              closeIconDisable={true}
              highlight={true}
              height={40}
              fontSize={16}
              popoverMt={36}
              renderInput={params =>
                <div ref={params.InputProps.ref} className="relative">
                  <TextField 
                   inputRef={(input) => {
                     inputRef = input;
                    }}
                     {...params} placeholder={"Select Home person"} variant="outlined" />
                </div>
              }
              options={options}
              renderOption={(option, { inputValue }) => {
                    return <ComboOptions option={option} inputValue={inputValue} />
                }}
             selectPeople={(val)=> onChange(val)}
             handleSelect={onSelect}
            />
       </Formik>
    </div>
  );
}

export default ComboBox;