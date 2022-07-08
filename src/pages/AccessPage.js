import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { connect } from "react-redux";
import { useMsal } from "@azure/msal-react";

//Components
import Input from "../components/Input";
import Typography from "../components/Typography";
import Button from "../components/Button";

//Actions
import { accessCodeValidation } from "../redux/actions/user";

const AccessPage = ({
    user: { accessCodeInvalid, accessCodeValidating },
    dispatchAccessCode
}) => {
    const [errors, setErrors] = useState(null);
    const { instance } = useMsal();

    useEffect(() => {
        if (accessCodeInvalid) {
            setErrors("Invalid access code");
        }
        else {
            setErrors("");
        }

    }, [accessCodeInvalid, setErrors])

    function validateCode(value) {
        if (!value) {
            setErrors('Access Code required');
        }
        else if (!/^[a-z0-9]*$/i.test(value)) {
            setErrors('Enter valid access code');
        }
        else {
            setErrors("")
        }
    }

    const onSubmitAccessCode = (accessCode) => {
        dispatchAccessCode(accessCode, instance);
    }

    return (
        <>
            <div className="home-page">
                <div className="flex flex-col justify-center items-center mt-32 p-8">
                    <div className="w-1/4">
                        <div className="mb-2">
                            <Typography
                                text="secondary"
                                weight="medium"
                                size={16}
                            >
                                Please enter an access code
                        </Typography>
                        </div>
                        <Formik
                            initialValues={{
                                accessCode: '',
                            }}
                            onSubmit={values => {
                                if (values.accessCode && errors === "") {
                                    onSubmitAccessCode(values.accessCode);
                                }
                            }}
                        >
                            {({ values }) => (
                                <Form>
                                    <div className="mb-4">
                                        <Field
                                            name="accessCode"
                                            validate={validateCode}
                                        >
                                            {({ form: { setFieldValue } }) => (
                                                <div className="mb-2">
                                                    <Input
                                                        id="accessCode"
                                                        name="accessCode"
                                                        type="text"
                                                        placeholder="Access Code"
                                                        value={values.accessCode}
                                                        handleChange={(e) => setFieldValue("accessCode", e.target.value)}
                                                        error={errors ? true : false}
                                                        errorMessage={errors}
                                                        hideTitleCase
                                                    />
                                                </div>
                                            )}
                                        </Field>
                                    </div>
                                    <button
                                        type="submit"
                                    > <Button
                                            type="primary"
                                            size="medium"
                                            title="Submit"
                                            disabled={values.accessCode === '' || errors}
                                            loading={accessCodeValidating}
                                        /> </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    )
}


const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchAccessCode: (accessCode, instance) => dispatch(accessCodeValidation(accessCode, instance))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AccessPage);