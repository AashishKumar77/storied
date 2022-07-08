import React, { lazy, useRef, useState, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

//Services
import { removeCookies } from "../services";

// Components
import Header from "../components/Header";
import Loader from "../components/Loader";
import PaymentRoute from "./PaymentRoute";
import NewspaperSearch from "./SearchPage/NewspaperSearch";
import NewsPaperStory from "./PersonViewPage/stories/NewsPaperStory";

// Pages
const HomePage = lazy(() => import('./HomePage'));
const FamilyPage = lazy(() => import('./FamilyPage'));
const ImageViewerPage = lazy(() => import('./ImageViewerPage'));
const PersonViewPage = lazy(() => import('./PersonViewPage'));
const LocationPage = lazy(() => import('./LocationPage'));
const SettingsPage = lazy(() => import('./SettingsPage'));
const TitleCase = lazy(() => import('./TitleCase'));
const SearchResult = lazy(() => import('./SearchPage/SearchResult'));
const PersonRecords = lazy(()=> import('./SearchPage/Person/PersonRecords'));
const RecordsPage = lazy(() => import('./SearchPage/RecordsPage'));
const NewspapperRecords = lazy(() => import('./SearchPage/NewspapperRecords'));
const Records = lazy(() => import('./../components/ImageViewer/Records'));
const ViewNews = lazy(() => import('./SearchPage/ViewNews'));
const AddStories = lazy(() => import('./PersonViewPage/stories/addStories'))
const ViewStories = lazy(() => import('./PersonViewPage/stories/ViewStories'))
const ViewImage = lazy(() => import('./ImageViewer'))
const NotFound = lazy(() => import('./NotFound'))

const UniversalSearchPage = lazy(() => import('./SearchPage/UniversalSearch'));
const WWISearchPage = lazy(() => import('./SearchPage/WWI/pages/SearchPage'));
const WWISearchPageList = lazy(() => import('./SearchPage/WWI/pages/SearchPageList'));
const WWIISearchPage = lazy(() => import('./SearchPage/WWII/pages/SearchPage'));
const WWIISearchPageList = lazy(() => import('./SearchPage/WWII/pages/SearchPageList'));

// US Federal Census
const USCensus1790SearchPage = lazy(() => import('./SearchPage/Census/1790/pages/SearchPage'))
const USCensus1790SearchPageList = lazy(() => import('./SearchPage/Census/1790/pages/SearchPageList'))
const USCensusl1800SearchPage = lazy(() => import('./SearchPage/Census/1800/pages/SearchPage'));
const USCensus1800SearchPageList = lazy(() => import('./SearchPage/Census/1800/pages/SearchPageList'));
const USCensus1810SearchPage = lazy(() => import('./SearchPage/Census/1810/pages/SearchPage'));
const USCensus1810SearchPageList = lazy(() => import('./SearchPage/Census/1810/pages/SearchPageList'));
const USCensus1820SearchPage = lazy(() => import('./SearchPage/Census/1820/pages/SearchPage'));
const USCensus1820SearchPageList = lazy(() => import('./SearchPage/Census/1820/pages/SearchPageList'));
const USCensus1830SearchPage = lazy(() => import('./SearchPage/Census/1830/pages/SearchPage'));
const USCensus1830SearchPageList = lazy(() => import('./SearchPage/Census/1830/pages/SearchPageList'));
const USCensus1940SearchPage = lazy(() => import('./SearchPage/Census/1940/pages/SearchPage'));
const USCensus1940SearchPageList = lazy(() => import('./SearchPage/Census/1940/pages/SearchPageList'));

// Deaths
const MassachusettsDeathsSearchPage = lazy(() => import('./SearchPage/Deaths/Massachusetts/pages/SearchPage'))
const MassachusettsDeathsSearcgPageList = lazy(() => import('./SearchPage/Deaths/Massachusetts/pages/SearchPageList'))
const OhioDeathsSearchPage = lazy(() => import('./SearchPage/Deaths/Ohio/pages/SearchPage'))
const OhioDeathsSearchPageList = lazy(() => import('./SearchPage/Deaths/Ohio/pages/SearchPageList'))



// SSDI
const USSocialSecuritySearchPage = lazy(() => import('./SearchPage/SSDI/United States/pages/SearchPage'))
const USSocialSecuritySearchPageList = lazy(() => import('./SearchPage/SSDI/United States/pages/SearchPageList'))

//Immigrants
const RussiansToAmericaPage = lazy(() => import('./SearchPage/Immigrants/RussiansToAmerica/pages/SearchPage'))
const RussiansToAmericaSearchPageList = lazy(() => import('./SearchPage/Immigrants/RussiansToAmerica/pages/SearchPageList'))
const GermanToAmericaSearchPage = lazy(() => import('./SearchPage/Immigrants/GermansToAmerica/pages/SearchPage'))
const GermanToAmericaSearchPageList = lazy(() => import('./SearchPage/Immigrants/GermansToAmerica/pages/SearchPageList'))
const ItaliansToAmericaSearchPage = lazy(() => import('./SearchPage/Immigrants/ItaliansToAmerica/pages/SearchPage'));
const ItaliansToAmericaSearchPageList = lazy(() => import('./SearchPage/Immigrants/ItaliansToAmerica/pages/SearchPageList'));
const IrishSearchPage = lazy(() => import('./SearchPage/Immigrants/Irish/pages/SearchPage'))
const IrishSearchPageList = lazy(() => import('./SearchPage/Immigrants/Irish/pages/SearchPageList'))

//Marriages
const MassachusettsMarriagesSearchPage = lazy(() => import('./SearchPage/Marriages/Massachusetts/pages/SearchPage'));
const MassachusettsMarriagesSearchPageList = lazy(() => import('./SearchPage/Marriages/Massachusetts/pages/SearchPageList'));
const TexasMarriagesSearchPage = lazy(() => import('./SearchPage/Marriages/Texas/pages/SearchPage'));
const TexasMarriagesSearchPageList = lazy(() => import('./SearchPage/Marriages/Texas/pages/SearchPageList'));
const WashingtonMarriagesSearchPage = lazy(() => import('./SearchPage/Marriages/Washington/pages/SearchPage'));
const WashingtonMarriagesSearchPageList = lazy(() => import('./SearchPage/Marriages/Washington/pages/SearchPageList'));
const NYCSearchPage = lazy(() => import('./SearchPage/Marriages/NewYork/pages/SearchPage'))
const NYCSearchPageList = lazy(() => import('./SearchPage/Marriages/NewYork/pages/SearchPageList'))



const Stories = lazy(() => import('./Stories'))
const Notifications = lazy(() => import('./../pages/Notifications'))
const PaymentPage = lazy(() => import('./../pages/Payment'))

const ProtectedRoutes = () => {
    const { instance } = useMsal();
    const fileObject = {
        x: 0,
        y: 0,
        zoom: 1,
    }
    const fileInputRef = useRef(null);
    const anchorRef = React.useRef(null);
    const [selectedFile, setSelectedFile] = useState(fileObject);
    const [imageFile, setImageFile] = useState(null);
    const [accountThumbnail, setAccountThumbnail] = useState(null);
    const [accountFile, setAccountFile] = useState(null);
    const [showInvalidModal, setShowInvalidModal] = useState(false);
    const [openAccountPopper, setOpenAccountPopper] = useState(false);


    const handleLogout = () => {
        instance.logoutRedirect({ postLogoutRedirectUri: "/" })
        removeCookies();
    }
    return (
        <>
            <Header
                handleLogout={handleLogout}
                fileInputRef={fileInputRef}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                imageFile={imageFile}
                setImageFile={setImageFile}
                setAccountThumbnail={setAccountThumbnail}
                accountThumbnail={accountThumbnail}
                anchorRef={anchorRef}
                showInvalidModal={showInvalidModal}
                setShowInvalidModal={setShowInvalidModal}
                openAccountPopper={openAccountPopper}
                setOpenAccountPopper={setOpenAccountPopper}
                accountFile={accountFile}
                setAccountFile={setAccountFile}
            />
            <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader/></div>}>
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/home" component={HomePage} />
                    <Route exact path="/family" component={FamilyPage} />
                    <Route exact path="/settings" component={SettingsPage} />
                    <Route exact path="/family/pedigree-view/:treeId/:primaryPersonId/:level" component={FamilyPage} />
                    <Route exact path="/family/person-page/:treeId/:primaryPersonId" component={PersonViewPage} />
                    <Route exact path="/search/person-records/:personId" component={PersonRecords} />
                    <Route exact path="/search/records" component={RecordsPage} />
                    <Route exact path="/search" component={UniversalSearchPage} />
                    <Route exact path="/ssdi/*" component={ImageViewerPage} />
                    <Route exact path="/census/:household/:householdId/:personId?" component={ImageViewerPage} />
                    <Route exact path="/ut/*" component={ImageViewerPage} />
                    <Route exact path="/test" component={LocationPage} />
                    <Route exact path="/titlecase" component={TitleCase} />
                    <Route exact path="/records/:recordId/:partitionKey" component={Records} />
                    <Route exact path="/stories/add/:refType/:treeId/:primaryPersonId" component={AddStories} />
                    <Route exact path="/stories/view/:refType/:storyId/:treeId/:primaryPersonId" component={ViewStories} />
                    <Route exact path="/media/view-image/:mediaId" component={ViewImage} />
                    <Route exact path="/stories/view-image/:mediaId/:refType" component={ViewImage} />
                    <Route exact path="/stories/edit/:refType/:storyId/:treeId/:primaryPersonId" component={AddStories} />
                    <Route exact path="/stories/add/newspaper/:recordId" component={NewsPaperStory} />
                    <Route exact path="/stories/add/:refType" component={AddStories} />
                    <Route exact path="/stories/view/:refType/:storyId" component={ViewStories} />
                    <Route exact path="/stories/edit/:refType/:storyId" component={AddStories} />
                    <Route exact path="/stories/add-from-media/:refType/:mediaId" component={AddStories}  />
                    <Route exact path="/stories" component={Stories} />
                    <Route exact path="/stories/:treeId/:primaryPersonId" component={Stories} />
                    <Route exact path="/notifications" component={Notifications} />

                    <Route exact path="/search/all-historical-records/result" component={SearchResult} />
                    <Route exact path="/search/world-war-i-casualties" component={WWISearchPage} />
                    <Route exact path="/search/world-war-i-casualties/result" component={WWISearchPageList} />
                    <Route exact path="/search/world-war-ii-army-enlistments/result" component={WWIISearchPageList} />
                    <Route exact path="/search/world-war-ii-army-enlistments" component={WWIISearchPage} />

                    {/*US Federal Census */}
                    <Route exact path="/search/1790-united-states-federal-census" component={USCensus1790SearchPage} />
                    <Route exact path="/search/1790-united-states-federal-census/result" component={USCensus1790SearchPageList} />
                    <Route exact path="/search/1800-united-states-federal-census" component={USCensusl1800SearchPage} />
                    <Route exact path="/search/1800-united-states-federal-census/result" component={USCensus1800SearchPageList} />
                    <Route exact path="/search/1810-united-states-federal-census" component={USCensus1810SearchPage} />
                    <Route exact path="/search/1810-united-states-federal-census/result" component={USCensus1810SearchPageList} />
                    <Route exact path="/search/1820-united-states-federal-census" component={USCensus1820SearchPage} />
                    <Route exact path="/search/1820-united-states-federal-census/result" component={USCensus1820SearchPageList} />
                    <Route exact path="/search/1830-united-states-federal-census" component={USCensus1830SearchPage} />
                    <Route exact path="/search/1830-united-states-federal-census/result" component={USCensus1830SearchPageList} />
                    <Route exact path="/search/1940-united-states-federal-census" component={USCensus1940SearchPage} />
                    <Route exact path="/search/1940-united-states-federal-census/result" component={USCensus1940SearchPageList} />

                    {/* Deaths */}
                    <Route exact path="/search/massachusetts-state-deaths" component={MassachusettsDeathsSearchPage} />
                    <Route exact path="/search/massachusetts-state-deaths/result" component={MassachusettsDeathsSearcgPageList} />
                    <Route exact path="/search/ohio-state-deaths" component={OhioDeathsSearchPage} />
                    <Route exact path="/search/ohio-state-deaths/result" component={OhioDeathsSearchPageList} />



                    {/* SSDI */}
                    <Route exact path="/search/united-states-social-security-death-index" component={USSocialSecuritySearchPage} />
                    <Route exact path="/search/united-states-social-security-death-index/result" component={USSocialSecuritySearchPageList} />

                    {/* Immigrants */}
                    <Route exact path="/search/russian-immigrants" component={RussiansToAmericaPage} />
                    <Route exact path="/search/russian-immigrants/result" component={RussiansToAmericaSearchPageList} />
                    <Route exact path="/search/german-immigrants" component={GermanToAmericaSearchPage} />
                    <Route exact path="/search/german-immigrants/result" component={GermanToAmericaSearchPageList} />
                    <Route exact path="/search/italian-immigrants" component={ItaliansToAmericaSearchPage} />
                    <Route exact path="/search/italian-immigrants/result" component={ItaliansToAmericaSearchPageList} />
                    <Route exact path="/search/irish-famine-passenger-records" component={IrishSearchPage} />
                    <Route exact path="/search/irish-famine-passenger-records/result" component={IrishSearchPageList} />

                    {/* Marriages */}
                    <Route exact path="/search/massachusetts-state-marriages" component={MassachusettsMarriagesSearchPage} />
                    <Route exact path="/search/massachusetts-state-marriages/result" component={MassachusettsMarriagesSearchPageList} />
                    <Route exact path="/search/texas-marriages" component={TexasMarriagesSearchPage} />
                    <Route exact path="/search/texas-marriages/result" component={TexasMarriagesSearchPageList} />
                    <Route exact path="/search/washington-state-marriages" component={WashingtonMarriagesSearchPage} />
                    <Route exact path="/search/washington-state-marriages/result" component={WashingtonMarriagesSearchPageList} />
                    <Route exact path="/search/new-york-city-marriages" component={NYCSearchPage} />
                    <Route exact path="/search/new-york-city-marriages/result" component={NYCSearchPageList} />

                    {/**Newspapper link */} 
                    <Route exact path="/search/newspapers" component={NewspaperSearch} />
                    <Route exact path="/search/newspapers/result" component={NewspapperRecords} />
                    <Route exact path="/search/newspaper/:recordId" component={ViewNews} />
                    
                    
                    <PaymentRoute exact path="/payment" component={PaymentPage} />
                    <Route component={NotFound} />
                </Switch>
            </Suspense>
        </>
    )
}

export default ProtectedRoutes;
