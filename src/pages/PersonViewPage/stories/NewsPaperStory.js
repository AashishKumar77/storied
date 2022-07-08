import React, { useState, useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Field, Formik } from "formik";
import Title from "./NewsPaperStories/title";
import Button from "../../../components/Button";
import Category from "./addStories/category";
import Person from "./addStories/person";
import { getRecentTree } from "../../../services";
import { getTreesListAsync } from "../../../redux/actions/homepage";
import { addMessage } from "../../../redux/actions/toastr";
import { decodeDataToURL } from "../../../utils";

const getTreeRedirect = (treeId, primaryPersonId) => {
	return !treeId && !primaryPersonId
}

const handleSubmit = (values, { setSubmitting }) => {
	setSubmitting(false)
	alert("Form is submitted")
}

const TitleVailed = (formikProp) => {
	let vaild = false
	if (formikProp?.values?.title && formikProp?.values?.content) {
		vaild = true
	}
	if (formikProp?.values?.content.length > 500) {
		vaild = false
	}
	return vaild
}

const getWidget = ({ step, setStep, formik, treeProfileId, urlImage, localImage }) => {
	switch (step) {
		case 1:
			return <div className="md:p-0 pl-4 pr-4 w-full flex justify-center"><Field treeProfileId={treeProfileId} component={Person} setStep={setStep} name="person" /></div>
		case 2:
			return <div className="md:p-0 pl-4 pr-4 w-full flex justify-center"><Category setStep={setStep} formik={formik} /></div>
		default:
			return <Title formik={formik} setStep={setStep} TitleVailed={TitleVailed} urlImage={urlImage} localImage={localImage} />
	}
}

const redirectToHomeFunc = async ({ history, treeId, primaryPersonId, treeIdUser, primaryPersonIdUser, userProfileAccount, setIsLoading, setTreeId, dispatch }) => {
	if (getTreeRedirect(treeId, primaryPersonId) && !treeIdUser && !primaryPersonIdUser) {
		setIsLoading(true);
		const trees = await getTreesListAsync(userProfileAccount.id)
		setIsLoading(false);
		if (trees.length) {
			setTreeId(trees[0].treeId)
		} else {
			dispatch(addMessage("Default tree has not been selected", "error"));
			history.push(`/`);
		}
	}
}

const backRedirect = ({ location, step, setStep, history, recordId }) => {
	switch (step) {
		case 0:
			history.push(`/search/newspaper/${recordId}${location.search}`);
			break;
		case 1:
			setStep(0)
			break;
		case 2:
			setStep(1)
			break;
		default:
			break;
	}
}

const PublisherTitle = () => {
	let { recordId } = useParams();
	let spiltName = recordId?.split('-')
	spiltName.splice(spiltName.length - 5, 5);
	return spiltName.join(" ");
}

const NewsPaperStory = () => {
	const history = useHistory()
	const dispatch = useDispatch()
	const location = useLocation();
	const { recordId } = useParams();
	const urlParams = decodeDataToURL(location.search)
	const [step, setStep] = useState(0);
	const { userProfileAccount } = useSelector(state => state.user);
	const [treeProfileId, setTreeId] = useState(null)
	const urlImage = urlParams.imgId ? urlParams.imgId : "";
	const localImage = localStorage.getItem("ClipThumbnail");
	const treeId = null;
	const primaryPersonId = null;
	const initialValues = {
		storyId: "",
		authorId: "",
		title: "",
		placeId: "",
		date: "",
		content: "",
		layoutId: "",
		storyCategories: [],
		person: [],
		place: { id: "", name: urlParams.loc ? urlParams.loc : "" },
		imageChange: false,
		privacy: "",
		publisher_title: PublisherTitle()
	}

	useEffect(() => {
		const obj = getRecentTree()
		let treeIdUser = null
		let primaryPersonIdUser = null
		if (obj) {
			treeIdUser = obj.treeId
			setTreeId(treeIdUser)
			primaryPersonIdUser = obj.primaryPersonId
		}
		userProfileAccount && redirectToHomeFunc({ history, treeId, primaryPersonId, treeIdUser, primaryPersonIdUser, userProfileAccount, setIsLoading: undefined, setTreeId, dispatch })
	}, [treeId, primaryPersonId, userProfileAccount])
	return <>
		<Formik
			initialValues={initialValues}
			onSubmit={handleSubmit}
			enableReinitialize={true}
		>
			{formik => {
				return <>
					<div className="h-full page-wrap-bg-dk story-page-wrap newspaper-story">
						<div className="relative main-wrapper mx-auto md:pt-10 pt-3 px-0">
							<div className="buton-wrap-top md:mt-2">
								<button onClick={() => backRedirect({ location, step, setStep, history, recordId })} type="button" className="bg-gray-100 rounded-lg px-2 py-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-inset">
									<svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M16.5 8L1.5 8" stroke="#212122" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
										<path d="M8.5 1L1.5 8L8.5 15" stroke="#212122" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</button>
								{step === 0 &&
									<div className="lg:hidden">
										<Button disabled={!TitleVailed(formik)} handleClick={() => setStep(1)} size="large" title="Next" />
									</div>
								}
							</div>
							<div className="page-box-wrap clip-story flex w-full justify-center">
								{getWidget({ step, setStep, formik, treeProfileId, urlImage, localImage })}
							</div>
						</div>
					</div>
				</>
			}}
		</Formik>
	</>
}

export default NewsPaperStory;