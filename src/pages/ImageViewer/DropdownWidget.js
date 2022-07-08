import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Typography from "../../components/Typography";
import TailwindModal from "../../components/TailwindModal";
import TailwindModalDialog from "../../components/TailwindModalDialog";
import Button from "../../components/Button";
import { useDispatch } from "react-redux";
import { updateMediaMetaData } from "../../redux/actions/media";
import SearchLocation from "../../components/FWSearchLocation";



const EditDetails = ({mediaDetails , setShowEditDialog , fieldName}) => {

  const dispatch = useDispatch()

  const storyWordCount = (values, dirty) => {
    let count = values?.length ? values?.length : 0 ;
    return count ? count : 0
  }

  const GetCharacterCount = ({ values, dirty }) => {
    return storyWordCount(values.description, dirty)
  }

  const formValidate = (values) => {
    let error = {
      invalid: "Invalid"
    };

    if (
      values.title === "" &&
      values.description === "" &&
      values.locationInfo.name === "" &&
      values.date === ""
    ) {
      error.invalid = "Invalid";
    } else {
      error = {};
    }
    return error;
  };


  const defaultValues = {
    title: mediaDetails?.mediaMetaData?.title ? mediaDetails?.mediaMetaData?.title : "",
    date: mediaDetails?.mediaMetaData?.date ? mediaDetails?.mediaMetaData.date.rawDate : "",
    locationInfo: {
      id: mediaDetails?.mediaMetaData?.locationId ? mediaDetails?.mediaMetaData?.locationId : null,
      name: mediaDetails?.mediaMetaData?.location ? mediaDetails?.mediaMetaData?.location : ""
    },
    location: mediaDetails?.mediaMetaData?.place ? mediaDetails?.mediaMetaData?.location : "",
    locationId: mediaDetails?.mediaMetaData?.place ? mediaDetails?.mediaMetaData?.locationId : null,
    description: mediaDetails?.mediaMetaData?.description ? mediaDetails?.mediaMetaData?.description : ""
  }



  return (
    <Formik
      initialValues={defaultValues}
      validate={formValidate}
      enableReinitialize={true}
      onSubmit={(values, { setSubmitting }) => {
        if (values["locationInfo"]) {
          const { name, id } = values["locationInfo"];
          values["location"] = name ? name : "";
          values["locationId"] = id ? id : null;
          delete values["locationInfo"];
        }
        const mediaId = mediaDetails?.mediaId
        const requestData = { mediaId, ...values }
        setShowEditDialog(false)
        dispatch(updateMediaMetaData(requestData, mediaId, setShowEditDialog))
        setSubmitting(false);
      }}

    >
      {({handleSubmit , dirty , isValid , isSubmitting , values}) => (
        <Form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-500 text-sm mb-1"
              htmlFor="grid-first-name"
            >
              Photo Title
            </label>
            <Field
              name="title"
              type="text"
              autoFocus = {fieldName === "title"}
              maxLength="35"
              className="appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-500 text-sm mb-1"
              htmlFor="grid-first-name"
            >
              Date
            </label>
            <Field
              name="date"
              type="text"
              autoFocus = {fieldName === "date"}
              maxLength="35"
              placeholder="e.g. 21 Jul 1953"
              className="appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-500 text-sm mb-1"
              htmlFor="grid-first-name"
            >
              Location
            </label>
            <div className="relative">
              <Field
                name={`locationInfo`}
                component={SearchLocation}
                autoFocus={fieldName === "location"}
                freeSolo={true}
                searchType={true}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-500 text-sm mb-1"
              htmlFor="grid-first-name"
            >
              Caption
            </label>
            <Field
              name="description"
              component="textarea"
              rows="3"
              autoFocus = {fieldName === "caption"}
              maxLength={500}
              className="appearance-none block w-full text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="float-right text-gray-500 text-xs mt-1">{GetCharacterCount({values ,dirty})}/500</div>
          </div>
         
          <div className="flex justify-end mt-10">
            <Button
              size="large"
              title="Cancel"
              className="text-gray-700 mr-7"
              type={"white"}
              handleClick={() => setShowEditDialog(false)}
            />
            <Button
              size="large"
              buttonType="submit"
              title={isSubmitting ? "Submitting" : "Save"}
              disabled={!dirty || !isValid || isSubmitting || GetCharacterCount({values ,dirty}) > 500}
            />
          </div>
        </Form>
      )}
    </Formik>
  )
}




const DropdownWidget = ({ mediaDetails , showEditDialog , setShowEditDialog ,setField, fieldName }) => {
  const [showWidget, setShowWidget] = useState(false);
  const [showDelDialog, setShowDelDialog] = useState(false);

  const handleDelete = () => {
    setShowDelDialog(false);
  };

  return (
    <>
      <button
        className="btn ellipsis-button"
        onClick={() => setShowWidget((prev) => !prev)}
      >
        <span>
          <svg
            width="4"
            height="16"
            viewBox="0 0 4 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.241211 13.752C0.241211 14.2161 0.425585 14.6613 0.753774 14.9895C1.08196 15.3176 1.52708 15.502 1.99121 15.502C2.45534 15.502 2.90046 15.3176 3.22865 14.9895C3.55684 14.6613 3.74121 14.2161 3.74121 13.752C3.74121 13.2879 3.55684 12.8428 3.22865 12.5146C2.90046 12.1864 2.45534 12.002 1.99121 12.002C1.52708 12.002 1.08196 12.1864 0.753774 12.5146C0.425585 12.8428 0.241211 13.2879 0.241211 13.752Z"
              fill="#747578"
            />
            <path
              d="M0.241211 2.25201C0.241211 2.71614 0.425585 3.16126 0.753774 3.48945C1.08196 3.81764 1.52708 4.00201 1.99121 4.00201C2.45534 4.00201 2.90046 3.81764 3.22865 3.48945C3.55684 3.16126 3.74121 2.71614 3.74121 2.25201C3.74121 1.78789 3.55684 1.34277 3.22865 1.01458C2.90046 0.686389 2.45534 0.502014 1.99121 0.502014C1.52708 0.502014 1.08196 0.686389 0.753774 1.01458C0.425585 1.34277 0.241211 1.78789 0.241211 2.25201Z"
              fill="#747578"
            />
            <path
              d="M0.241211 8.00201C0.241211 8.46614 0.425585 8.91126 0.753774 9.23945C1.08196 9.56764 1.52708 9.75201 1.99121 9.75201C2.45534 9.75201 2.90046 9.56764 3.22865 9.23945C3.55684 8.91126 3.74121 8.46614 3.74121 8.00201C3.74121 7.53789 3.55684 7.09277 3.22865 6.76458C2.90046 6.43639 2.45534 6.25201 1.99121 6.25201C1.52708 6.25201 1.08196 6.43639 0.753774 6.76458C0.425585 7.09277 0.241211 7.53789 0.241211 8.00201Z"
              fill="#747578"
            />
          </svg>
        </span>
      </button>
      {showWidget ? (
        <ClickAwayListener onClickAway={() => setShowWidget(false)}>
          <div className="story-dropdown">
            <div className="dropdown-content">
              <button onClick={() => {
                setField("title")
                setShowEditDialog(true);
                setShowWidget(false)
              }}>
                <Typography size={14} text="secondary">
                  Edit Details
                </Typography>
              </button>

              <button disabled onClick={() => setShowDelDialog(true)}>
                <Typography size={14} text="danger">
                  Delete Photo
                </Typography>
              </button>
            </div>
          </div>
        </ClickAwayListener>
      ) : null}
      <TailwindModal
        title="Edit Photo Details"
        showClose={true}
        content={<EditDetails mediaDetails={mediaDetails} fieldName={fieldName} setShowEditDialog={setShowEditDialog} />}
        showModal={showEditDialog}
        setShowModal={setShowEditDialog}
        innerClasses="max-w-sm"
      />
      <TailwindModalDialog
        title="Are you sure?"
        content="Are you sure you want to delete this photo?"
        showModal={showDelDialog}
        setShowModal={setShowDelDialog}
        handleAction={handleDelete}
      />
    </>
  );
};
export default DropdownWidget;
