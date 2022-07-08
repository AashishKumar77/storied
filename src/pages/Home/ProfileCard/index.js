import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getQueryParam, tr } from "../../../components/utils";
import { removeRecentTree } from "../../../services";
import { getAvatarName } from "../../../utils";
import { addRecentViewTree } from "../../../redux/actions/homepage";
import Typography from "../../../components/Typography";
import ProfileLoader from "./ProfileLoader";
import "./../index.css";
const ProfileCard = ({ width }) => {

    const { trees, treesLoading } = useSelector(state => state.homepage)
    const { userFirstName, userLastName, imgSrc } = useSelector(state => state.user)
    const { storiesCount } = useSelector(state => state.homepage)
    const history = useHistory()
    const [treesData, setTreesData] = useState([])
    const [showlessData, setShowlessData] = useState(true)

    const { t } = useTranslation();

    const showMore = () => {
        setTreesData(trees)
        setShowlessData(false)
    }

    const showLess = () => {
        setTreesData(trees.slice(0, 3))
        setShowlessData(true)
    }

    useEffect(() => {
        if (trees && trees.length > 0) {
            setTreesData(trees.slice(0, 3))
        }
    }, [trees])

    const handleAddNewTree = () => {
        removeRecentTree();
        history.push("/family");
    }

    const handleViewTree = async (treeId, personId) => {
        addRecentViewTree(treeId)
        removeRecentTree();
        if (getQueryParam()) return history.push(`/family/pedigree-view/${treeId}/${personId}/4?${getQueryParam()}`);
        return history.push(`/family/pedigree-view/${treeId}/${personId}/4`)
    }



    const treeIcon = () => {
        return <div className="icon w-4 mr-2"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.125 12.624C8.57272 12.624 8.125 12.1763 8.125 11.624V9.874C8.125 9.32172 8.57272 8.874 9.125 8.874H11.625C12.1773 8.874 12.625 9.32172 12.625 9.874V11.624C12.625 12.1763 12.1773 12.624 11.625 12.624H9.125Z" stroke="#388367" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.375 8.874C1.82272 8.874 1.375 8.42629 1.375 7.874L1.375 6.124C1.375 5.57172 1.82272 5.124 2.375 5.124H4.875C5.42728 5.124 5.875 5.57172 5.875 6.124V7.874C5.875 8.42629 5.42728 8.874 4.875 8.874H2.375Z" stroke="#388367" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.125 5.124C8.57272 5.124 8.125 4.67629 8.125 4.124V2.374C8.125 1.82172 8.57272 1.374 9.125 1.374H11.625C12.1773 1.374 12.625 1.82172 12.625 2.374V4.124C12.625 4.67629 12.1773 5.124 11.625 5.124H9.125Z" stroke="#388367" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6.25 7L10 6.999" stroke="#388367" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 5.5V8.5V5.5Z" fill="#388367" />
            <path d="M10 5.5V8.5" stroke="#388367" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        </div>
    }

    const getTreeValue = (tree) => {
        if (tree.personCount) {
            return tree.personCount === 1 ? `1 ${tr(t, "home.profile.person")}` : `${tree.personCount} ${tr(t, "home.profile.People")}`;
        } else {
            return tr(t, "home.profile.noTrees");
        }
    }

    const getStoryValue = () => {
        if (storiesCount) {
            return storiesCount === 1 ? `1 ${tr(t, "home.profile.story")}` : `${storiesCount} ${tr(t, "home.profile.stories")}`;
        } else {
            return tr(t, "home.profile.noStories");
        }
    }
    const storyValue = !treesLoading && <div className="p-card-list-items">
        <div className="flex items-center pc-list-item hover:bg-gray-200 cursor-pointer rounded-md py-2.5 px-3">
            <div className="icon w-4 mr-2">
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.25 13.5625H2.0625C1.7144 13.5625 1.38056 13.4242 1.13442 13.1781C0.888281 12.9319 0.75 12.5981 0.75 12.25" stroke="#C93030" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2.5 0.4375C2.03587 0.4375 1.59075 0.621874 1.26256 0.950063C0.934375 1.27825 0.75 1.72337 0.75 2.1875V12.25C0.75 11.9019 0.888281 11.5681 1.13442 11.3219C1.38056 11.0758 1.7144 10.9375 2.0625 10.9375H10.8125C10.9285 10.9375 11.0398 10.8914 11.1219 10.8094C11.2039 10.7273 11.25 10.616 11.25 10.5V0.875C11.25 0.758968 11.2039 0.647688 11.1219 0.565641C11.0398 0.483594 10.9285 0.4375 10.8125 0.4375H2.5Z" stroke="#C93030" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.375 13.5625V10.9375" stroke="#C93030" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3.375 9.1875C3.375 8.49131 3.65156 7.82363 4.14384 7.33134C4.63613 6.83906 5.30381 6.5625 6 6.5625C6.69619 6.5625 7.36387 6.83906 7.85615 7.33134C8.34844 7.82363 8.625 8.49131 8.625 9.1875H3.375Z" stroke="#C93030" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.25 4.8125C4.25 5.27663 4.43437 5.72175 4.76256 6.04994C5.09075 6.37813 5.53587 6.5625 6 6.5625C6.46413 6.5625 6.90925 6.37813 7.23744 6.04994C7.56563 5.72175 7.75 5.27663 7.75 4.8125C7.75 4.34837 7.56563 3.90325 7.23744 3.57506C6.90925 3.24687 6.46413 3.0625 6 3.0625C5.53587 3.0625 5.09075 3.24687 4.76256 3.57506C4.43437 3.90325 4.25 4.34837 4.25 4.8125Z" fill="white" stroke="#C93030" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div onClick={() => history.push(`/stories`)} className="text flex-grow">
                <div className="flex justify-between">
                    <p className="pr-2"><Typography size={12} text="secondary" weight="medium">Stories</Typography></p>
                    <p className="whitespace-nowrap">
                        <Typography size={10}>{getStoryValue()}</Typography>
                    </p>
                </div>
            </div>
        </div>
    </div>
    const noTree = !treesLoading && trees.length === 0 && <div className="flex items-center pc-list-item hover:bg-gray-200 cursor-pointer rounded py-2.5 px-3">
        {treeIcon()}
        <div className="text flex-grow">
            <div className="flex justify-between">
                <p className="pr-2 two-lines-ellipsis"><Typography size={12} text="secondary" weight="medium"> {tr(t, "home.profile.trees")} </Typography></p>
                <p className="whitespace-nowrap">
                    <Typography size={10}>{tr(t, "home.profile.noTrees")}</Typography>
                </p>
            </div>
        </div>
    </div>
    const mobileView =
        <div className="card-content px-3">
            <div className="p-card-list-items">
                {noTree}
                {!treesLoading && treesData.length > 0 &&
                    <div onClick={() => handleViewTree(treesData[0].treeId, treesData[0].homePersonId)} className="flex items-center pc-list-item hover:bg-gray-200 cursor-pointer rounded py-2.5 px-3">
                        {treeIcon()}
                        <div className="text flex-grow">
                            <div className="flex justify-between">
                                <p className="pr-2"><Typography size={12} text="secondary" weight="medium"> {treesData[0].treeName} </Typography></p>
                                <p className="whitespace-nowrap">
                                    <Typography size={10}>{getTreeValue(treesData[0])}</Typography>
                                </p>
                            </div>
                        </div>
                    </div>
                }

                <>
                </>
                {storyValue}
            </div>
        </div>;

    const desktopView = () => <>
        {!treesLoading && <div className="head avatar-top px-6 border-b border-gray-200 py-4 mb-2">
            <div className="flex items-center">
                <div className="mr-3 card-avatar avtar-circle-large rounded-full overflow-hidden w-10 h-10 bg-gray-700 flex items-center justify-center">
                    {imgSrc ? <img src={imgSrc} className="w-10 h-10 object-cover" /> : <Typography
                        size={14}
                        text="secondary"
                        weight="medium"
                    >
                        <span className="text-white">
                            {userFirstName && getAvatarName(userFirstName)}
                            {userLastName && getAvatarName(userLastName)}
                        </span>
                    </Typography>}
                </div>
                <div className="flex-grow inside-span-block avtar-circle-large-name main-title truncate overflow-ellipsis">
                    <Typography
                        size={14}
                        text="secondary"
                        weight="medium"
                    >
                        {userFirstName} {userLastName}
                    </Typography>
                </div>
            </div>
        </div>}
        <div className="card-content px-3">
            <div className="p-card-list-items">
                {noTree}
                {!treesLoading && treesData.length > 0 && treesData.map((tree, tIndex) => (
                    <div key={tIndex} onClick={() => handleViewTree(tree.treeId, tree.homePersonId)} className="flex items-center pc-list-item hover:bg-gray-200 cursor-pointer rounded py-2.5 px-3">
                        {treeIcon()}
                        <div className="text flex-grow">
                            <div className="flex justify-between">
                                <p className="pr-2"><Typography size={12} text="secondary" weight="medium"> {tree.treeName} </Typography></p>
                                <p className="whitespace-nowrap">
                                    <Typography size={10}>{getTreeValue(tree)}</Typography>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                <>
                    {!treesLoading && trees.length > 3 && <>
                        {showlessData ? (<div onClick={() => showMore()} className="flex items-center pc-list-item py-2.5 px-3">
                            <p className="pr-2 flex ml-6 items-center cursor-pointer">
                                <Typography size={12} text="secondary" weight="medium">More</Typography>
                                <span className="mt-1 ml-1">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.25 0.853745L4.82333 4.42674C4.84652 4.44997 4.87406 4.46839 4.90437 4.48096C4.93469 4.49353 4.96718 4.5 5 4.5C5.03282 4.5 5.06531 4.49353 5.09563 4.48096C5.12594 4.46839 5.15348 4.44997 5.17667 4.42674L8.75 0.853745" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </p>
                        </div>) : (<div onClick={() => showLess()} className="flex items-center pc-list-item py-2.5 px-3">
                            <p className="pr-2 flex ml-6 items-center cursor-pointer">
                                <Typography size={12} text="secondary" weight="medium">Less</Typography>
                                <span className="mt-0.5 ml-1">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.25 5.14625L4.82333 1.57325C4.84652 1.55003 4.87406 1.53161 4.90437 1.51904C4.93469 1.50647 4.96718 1.5 5 1.5C5.03282 1.5 5.06531 1.50647 5.09563 1.51904C5.12594 1.53161 5.15348 1.55003 5.17667 1.57325L8.75 5.14625" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </p>
                        </div>)}
                    </>}
                </>

                {!treesLoading && trees && trees.length > 0 && <div onClick={handleAddNewTree} className="flex items-center pc-list-item hover:bg-gray-200 cursor-pointer rounded-md py-2.5 px-3">
                    <div className="icon w-4 mr-2"><svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.875 7H12.125" stroke="#388367" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6.5 1.375V12.625" stroke="#388367" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    </div>
                    <div className="text flex-grow">
                        <p className="pr-2"><Typography size={12} text="secondary" weight="medium">New Tree</Typography></p>
                    </div>
                </div>}
                {storyValue}
            </div>
        </div></>
    return <>
        <div id="profile-card" className="bg-white card home-profile-card">
            <div className="card-content-wrap pb-4">
                {treesLoading && <ProfileLoader width={width} />}
                {width < 512 ? mobileView :
                    desktopView()}
            </div>
        </div>
    </>
}

export default ProfileCard;