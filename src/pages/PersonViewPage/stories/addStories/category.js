import React from 'react';
import Typography from "./../../../../components/Typography";
import Button from "./../../../../components/Button"
import { Field, } from 'formik'
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';
import { getStoryRedirectUrl } from '../../../../utils'
const Category = ({ setStep, formik }) => {
    const { storyId, treeId, primaryPersonId, refType } = useParams();
    const history = useHistory();
    const categories = [
        "Achievements",
        "Attributes",
        "Career",
        "Challenges",
        "Education",
        "Health",
        "Hobbies",
        "Immigration",
        "Memories",
        "Military",
        "Possessions",
        "Relationships",
        "Religion"
    ]
    const {isLoading} = useSelector(state => state.story)
    const getSaveButton = () => {
        const disableBool = !formik.dirty  || formik.values?.storyCategories?.length <= 0;
        if( storyId && disableBool) {
            return <Button  size="large" title={"Save"} handleClick = {()=>{
                const url = getStoryRedirectUrl({refType, treeId, primaryPersonId})
                history.push(url)
                }}/>
        } else {
            return <Button disabled={ disableBool || formik.isSubmitting || isLoading } handleClick={formik.handleSubmit} size="large" title={formik.isSubmitting || isLoading ? "Saving.." : "Save"} />
        }
    }
    return <div className="story-box add-category-box">
        <div className="story-body">
            <div className="story-title mb-4">
                <h2><Typography text="secondary" size={32} weight="lyon-medium">What categories apply?</Typography></h2>
            </div>
            <div>
                <div className="smm:mb-1.5 lg:mb-11">
                    <p className="text-sm mb-6">Select one or more. This helps to organize your stories.</p>
                    <div className="categories">
                        {categories.map((cat, cIndex) =>
                            <label key = {cIndex} className="cat-button group">
                                <Field type="checkbox" name="storyCategories" value={cat} />
                                <span className="label">{cat}</span>
                            </label>
                        )}
                    </div>
                </div>
            </div>
            <div className="story-footer justify-end flex fixed -top-4 smm:-top-3 right-4 lg:top-0 lg:right-0 lg:relative z-1000 lg:z-50">
                <div className="flex">
                    <div className="mr-2 hidden lg:flex">
                        <Button handleClick={() => setStep(1)} size="large" title="Back" type="default" />
                    </div>
                    {getSaveButton()}
                </div>
            </div>
        </div>
    </div>
}

export default Category