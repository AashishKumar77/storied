export const API_BASEPATH = "https://stage.newspaperarchive.com/api/";
export const STORIED_TEST_URL = "https://api.test.storied.com";
export const STORIED_BASE_URL = process.env.REACT_APP_API;
export const IMAGEAPIURL = "https://imgapi.storied.com";
export const PAYMENT_BASE_URL = "https://qasecureapi.newspaperarchive.com";
export const LOGIN = `${API_BASEPATH}admin/login`;
export const CONTENTSEARCH = `${STORIED_BASE_URL}/api/contentsearch`;
export const WWISEARCH = `${STORIED_BASE_URL}/api/wwi`;
export const WW2SEARCH = `${STORIED_BASE_URL}/api/wwii`;
export const PLACEAUTHIRITY = `${STORIED_BASE_URL}/api/placeauthority/lookup`
export const userTrees = (userId) => `${STORIED_BASE_URL}/api/Users/trees`
export const treePeople = (treeId) => `${STORIED_BASE_URL}/api/Trees/${treeId}/listPeople`
export const getAllPersons = `${STORIED_BASE_URL}/api/Users/listAllPeople`
export const viewRecord = ({ recordId, partitionKey }) => `${STORIED_BASE_URL}/api/recorddetail/${recordId}/${partitionKey}`
export const saveToTreeApi = ({ personId }) => `${STORIED_BASE_URL}/api/Persons/${personId}/saverecord`
export const researchSavedRecord = ({ primaryPersonId }) => `${STORIED_BASE_URL}/api/Persons/${primaryPersonId}/personrecords`
export const saveStoryApi = `${STORIED_BASE_URL}/api/story`
export const editStoryApi = `${STORIED_BASE_URL}/api/Story/editstory`
export const viewStory = ({ storyId }) => `${STORIED_BASE_URL}/api/Story/${storyId}`
export const updateStoryIsLiked = ({ storyId, isLiked }) => `${STORIED_BASE_URL}/api/Story/${storyId}/${isLiked}`;
export const storylikespersons = ({ storyId, pageNumber = 1, pageSize = 30 }) => `${STORIED_BASE_URL}/api/Story/${storyId}/${pageNumber}/${pageSize}/storylikespersons`;
export const getStories = ({ treeId, personId, pageNumber = 1, pageSize = 10 }) => `${STORIED_BASE_URL}/api/persons/${treeId}/${personId}/${pageNumber}/${pageSize}/PersonStories`
export const deleteStoryPerson = `${STORIED_BASE_URL}/api/Story/removetaggedperson`
export const updatePrivacyStatus = `${STORIED_BASE_URL}/api/story/updateprivacy`
export const collectionDropDown = `${STORIED_BASE_URL}/api/ContentCatalog`
export const eventDropDown = `${STORIED_BASE_URL}/api/ContentCatalog/event`
export const deleteStory = (StoryId) => `${STORIED_BASE_URL}/api/Story/${StoryId}/delete`
export const getContentCatalog = ({ partitionKey }) => `${STORIED_BASE_URL}/api/ContentCatalog/${partitionKey}`
export const USFEDERALCENSUSSEARCH = `${STORIED_BASE_URL}/api/Census`;
export const getLeftPanelDetails = ({ treeId, personId }) => `${STORIED_BASE_URL}/api/persons/${treeId}/${personId}/personstoriescountbycategories`
export const getLeftPanelDetailsOwner = () => `${STORIED_BASE_URL}/api/Users/authorstoriescountbycategories`
export const getRightPanelDetails = ({ treeId, personId }) => `${STORIED_BASE_URL}/api/persons/${treeId}/${personId}/parentsinfo`
export const getSpousesWithChildren = ({ treeId, personId }) => `${STORIED_BASE_URL}/api/persons/${treeId}/${personId}/spouseswithchildren`;
export const getHomepageStories = ({  pageNumber = 1, pageSize = 10 }) => `${STORIED_BASE_URL}/api/users/stories/${pageNumber}/${pageSize}`
export const getOwnStories = ({  pageNumber = 1, pageSize = 10 }) => `${STORIED_BASE_URL}/api/users/${pageNumber}/${pageSize}/authorstories`
export const getStoriesCount = ({ authorId }) => `${STORIED_BASE_URL}/api/Users/authorstoriescount `
export const getTreesList = ({ authorId }) => `${STORIED_BASE_URL}/api/Users/trees`
export const getTreesASYNC = ({ authorId }) => `Users/trees`
export const getImageFromImageId = `${IMAGEAPIURL}/StoriedThumbnail`
export const RUSSIANSEARCH = `${STORIED_BASE_URL}/api/Immigrants/RussianToAmerica`;
export const getFormDropdowns = (formGUID) =>
  `${STORIED_BASE_URL}/api/search/forms/${formGUID}/dropdowns`;
export const IRISHSEARCH = `${STORIED_BASE_URL}/api/Immigrants/Irish`;
export const getRecentPeople = () =>
  `${STORIED_BASE_URL}/api/Users/recentpeoplecard`;
export const GERMANTOAMERICANSEARCH = `${STORIED_BASE_URL}/api/Immigrants/GermanToAmerica`;
export const ITALIANSTOAMERICANSEARCH = `${STORIED_BASE_URL}/api/Immigrants/ItalianstoAmerica`;
export const USSOCIALSECURITY = `${STORIED_BASE_URL}/api/Deaths/Ssdi`;
export const MASSACHUSSETS = `${STORIED_BASE_URL}/api/Deaths/Massachusetts`;
export const USCENSUS = `${STORIED_BASE_URL}/api/census/1790`;
export const getMedia = ({ mediaId }) =>
  `${STORIED_BASE_URL}/api/media/${mediaId} `;
export const NYC = `${STORIED_BASE_URL}/api/Marriages/NewYork`;
export const UPDATEMEDIAMETADATA = `${STORIED_BASE_URL}/api/media/updatemediametadata`;
export const getUserDetail = ({ userId }) =>
  `${STORIED_BASE_URL}/api/users/${userId}/userdetail`;
export const ADDPERSONTOMEDIA = `${STORIED_BASE_URL}/api/media/addpersontomedia`;
export const REMOVEPERSONFROMMEDIA = `${STORIED_BASE_URL}/api/media/removepersonfrommedia`;
export const TEXASMARRIAGESSEARCH = `${STORIED_BASE_URL}/api/Marriages/Texas`;
export const getNotifications = `${STORIED_BASE_URL}/api/Users/notifications`;
export const getUserInfo = (userid) =>
  `${STORIED_BASE_URL}/api/Users/${userid}/info`;
export const MarkedRead = `${STORIED_BASE_URL}/api/User/marknotificationread`;

export const SUBMITCARDDETAILS = `${PAYMENT_BASE_URL}/api/Account/StoriedCreditCardProcessing`;
export const USFEDERAL1800SEARCH = `${STORIED_BASE_URL}/api/Census/1800`;
export const WASHINGTONMARRAGES = `${STORIED_BASE_URL}/api/Marriages/Washington`;
export const USFEDERALCENSUS1810 = `${STORIED_BASE_URL}/api/Census/1810`;
export const USFEDERALCENSUS1820 = `${STORIED_BASE_URL}/api/Census/1820`;
export const USFEDERALCENSUS1830 = `${STORIED_BASE_URL}/api/Census/1830`;
export const MMSEARCH = `${STORIED_BASE_URL}/api/Marriages/Massachusetts`;
export const PERSONCLUEAPI = ({ personId }) => `${STORIED_BASE_URL}/api/persons/${personId}/personsclue`;
export const COUNTRY = `${STORIED_BASE_URL}/api/NewsPaperSearch/countries`;
export const getState = (countryId)=>`${STORIED_BASE_URL}/api/NewsPaperSearch/statebycountryid/${countryId}`;
export const getCity = (stateId)=>`${STORIED_BASE_URL}/api/NewsPaperSearch/citiesbystateid/${stateId}`;
export const getPublication = (cityId, stateId)=>`${STORIED_BASE_URL}/api/NewsPaperSearch/pubtitlebycityid/${stateId}/${cityId}`;
export const PERSONRRECORDSAPI = (personId) => `${STORIED_BASE_URL}/api/persons/${personId}/contentsearch`;
export const getADB2CUserInfo = (userid) =>
  `${STORIED_BASE_URL}/api/Users/${userid}/adb2cinfo`;
export const getPublications = `${STORIED_BASE_URL}/api/NewsPaperSearch/newspapersearch`
export const updateLastTimeUserSawNotification = `${STORIED_BASE_URL}/api/User/updatelasttimeusersawnotification`;
export const OHIODEATHS = `${STORIED_BASE_URL}/api/Deaths/Ohio`;

