import React, {
   useState,
   useEffect,
   useCallback,
   useRef,
   useMemo,
} from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ClassNames from "classnames";
import MMLoader from "../../../../../components/Loader";
import Typography from "../../../../../components/Typography";
import Button from "../../../../../components/Button";
import TWPaginationComponent from "../../../../../components/Pagination/TWPaginationComponent";
import TailwindModal from "../../../../../components/TailwindModal";
import {
   clearMMFormQuery,
   submitMMForm
} from "../../../../../redux/actions/massachusettsMarriages";
import { getLocationGUID } from "../../../../../redux/actions/ww1";
import { ssdi, updateContentCatalog } from "../../../../../redux/actions/sidebar";
import {
   pageRecordsCountfn,
   getButtonTitle,
   getFirstName,
   decodeDataToURL,
   encodeDataToURL,
   getPageSize,
   mergeDeep,
   formDataTrim,
   getMassachusettsMarriagesDefaultValues
} from "../../../../../utils";
import MMTable from "../../../Table";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import MassachusettsMarriagesSearchForm from "../components/SearchForm";
import MassachusettsMarriagesRefineSearch from "../components/RefineSearch";
import { ListingPageheaderContent, PaginationResult } from "../../../../../utils/search";
import { updateMarriagePlace } from "../../../utils/common";



const getValuesForm = (formValues) => {
   const _values = { ...formValues };
   let MarriageObj = updateMarriagePlace(_values);
   return {
      ..._values,
      ...MarriageObj,
   };
};
const setFormData = (setValues, _values, MarriageObj) => {
   setValues({
      ...mergeDeep(getMassachusettsMarriagesDefaultValues(), _values),
      Marriage: {
         id: _values?.m?.li?.i,
         name: _values?.m?.l?.l,
         ...(MarriageObj ? { levelData: MarriageObj } : {}),
      },
      ps: getPageSize(_values.ps),
   });
};
const getData = async (search, history, setValues) => {
   if (search) {
      const _values = decodeDataToURL(search);
      let MarriageObj = null;
      if (_values?.m?.li?.i) {
         MarriageObj = await getLocationGUID(_values.m?.li?.i);
      }
      setFormData(setValues, _values, MarriageObj);
   } else {
      history.push("/search/massachusetts-state-marriages");
   }
};
const genarateUrl = (formValues, history, page = 1) => {
   const _mmValues = { ...formValues };
   if (!_mmValues.fm.t) {
      delete _mmValues.fm;
   }
   if (!_mmValues.ln.t) {
      delete _mmValues.ln;
   }
   if (_mmValues.Marriage) {
      delete _mmValues.Marriage;
   }
   if (!_mmValues.matchExact) {
      delete _mmValues.matchExact;
   }
   history.push(`?${encodeDataToURL({ ...formDataTrim(_mmValues), pn: page })}`);
};

const SearchPageList = () => {

   const location = useLocation();
   const newRequest = useRef(true);
   const [isPageLoad, setisPageLoad] = useState(true);
   const [tableSize, setTableSize] = useState(null);
   const [tableColTotal, setTableColTotal] = useState(0);
   const [tableColWidth, setTableColWidth] = useState([]);
   const [showModal, setShowModal] = useState(false);
   const [values, setValues] = useState(null);
   const [valuesNew, setValuesNew] = useState(null);

   const history = useHistory();
   const { totalRecords, maskingFields } = useSelector(
      (state) => {
         return state.massachusettsMarriages;
      }
   );
   const { contentCatalog } = useSelector((state) => {
      return state.sidebar;
   });
   const dispatch = useDispatch();
   const { t } = useTranslation();
   const getMMList = useCallback(
      (formValues = values) => {
         if (formValues !== null) {
            const _values = getValuesForm(formValues);
            dispatch(submitMMForm(_values, newRequest.current));
         }
         newRequest.current = false;
      },
      [dispatch, values, newRequest]
   );

   useEffect(() => {
      getData(location.search, history, setValues);
   }, [setValues, location.search, history]);


   useEffect(() => {
      getMMList();
      return () => {
         let pathName = history.location.pathname;
         if (pathName !== "/search/massachusetts-state-marriages/result" && pathName.split("/")?.[1] !== "records") {
            localStorage.removeItem('switch_status');
            dispatch(updateContentCatalog())
            dispatch(clearMMFormQuery())
         }
      }

   }, [getMMList]);


   const handleSubmitMassachusettsMarriages = (formValues) => {
      newRequest.current = true;
      setShowModal(false);
      genarateUrl(formValues, history);
   };
   const getMMListPage = (page) => {
      let data = { ...values, pn: page };
      genarateUrl(data, history, page);
      setisPageLoad(false);
   };
   const changeLimit = (pageLimit) => {
      let data = { ...values, pn: 1, ps: pageLimit };
      genarateUrl(data, history);
      setisPageLoad(false);
   };
   const { MMList, loading, pageLoading, error } = useSelector(
      (state) => state.massachusettsMarriages
   );

   const MMpageRecords = useMemo(() => {
      return pageRecordsCountfn(
         loading,
         error,
         totalRecords,
         values?.ps,
         values?.pn
      );
   }, [loading, error, totalRecords, values]);

   useEffect(() => {
      dispatch(ssdi({}));
   }, [dispatch]);


   const buttonTitle = getButtonTitle(values);
   const handleShowUSModalNew = (bool) => {
      handleShowUSModal(bool);
   };
   const getTableSize = (width) => {
      setTableSize(width);
   };
   const handleShowUSModal = (bool) => {
      let formValue = mergeDeep(getMassachusettsMarriagesDefaultValues(), values);
      bool && setValuesNew(formValue);
      setShowModal(bool);
   };

   const handleTableColWidth = (width) => {
      setTableColWidth(width);
   };
   const handleTableColTotal = (width) => {
      setTableColTotal(width);
   };
   const buttons = () => {
      return (<div className="links w-full flex justify-center">
         <Button
            handleClick={(e) => {
               e.preventDefault();
               handleShowUSModal(true);
            }}
            title="Edit Search"
            type="default"
         />
         <Button
            handleClick={(e) => {
               e.preventDefault();
               handleShowUSModalNew(true);
            }}
            type="default"
            title="New Search"
         />
      </div>)
   }
   const getDeathsHTMLData = () => {
      if (loading) {
         return (
            <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
               <div className="absolute top-50 z-50 top-2/4 left-2/4">
                  <MMLoader />
               </div>
            </div>
         );
      } else {
         return MMList.length === 0 ? (
            <Norecords
               searchResult={MMList}
               isLoading={false}
               firstName={getFirstName(values)}
            />
         ) : (
            <MMTable
               tableSize={getTableSize}
               handleTableColWidth={handleTableColWidth}
               handleTableColTotal={handleTableColTotal}
               data={MMList}
               maskingFields={maskingFields}
               error={error}
               loading={loading}
               isPageLoad={isPageLoad}
               tableColWidth={tableColWidth}
               tableColTotal={tableColTotal}
            />
         );
      }
   };
   return (
      <>
         <div className="page-wrap ww-results-wrap">
            {pageLoading ? (
               <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
                  <div className="absolute top-50 z-50 top-2/4 left-2/4">
                     <MMLoader />
                  </div>
               </div>
            ) : (
               <div className="container mx-auto">
                  <div className="head w-full text-center mb-4">
                     {ListingPageheaderContent(contentCatalog?.collectionTitle)}
                     <div className="edit-new-link-wrap text-center mb-5 sml:hidden">
                        {buttons()}
                     </div>
                     <div>
                        {MMpageRecords !== 0 && (
                           <p>
                              <Typography
                                 fontFamily="primaryFont"
                                 size={14}
                                 text="secondary"
                                 weight="light"
                              >
                                 {PaginationResult(
                                    t,
                                    MMpageRecords,
                                    values?.ps,
                                    values?.pn,
                                    totalRecords
                                 )}
                              </Typography>{" "}
                           </p>
                        )}
                     </div>
                  </div>
                  <div className="ww-grid">
                     <div className="relative ww-col-right">
                        <div className="flex">
                           <div className="table-content bg-white sm:rounded-lg sm:shadow text-left">
                              {getDeathsHTMLData()}
                           </div>
                        </div>
                        <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                           <TWPaginationComponent
                              totalRecords={totalRecords}
                              changeLimit={changeLimit}
                              getList={getMMListPage}
                              currentPage={parseInt(values?.pn || 0)}
                              limitPerPage={parseInt(values?.ps || 20)}
                              tableSize={tableSize}
                           />
                        </div>
                     </div>
                     <div className={ClassNames("mb-8 sidebar-search hidden flex-col", { "sml:flex": !pageLoading && !loading, })}>
                        <div className="bg-white sm:rounded-lg shadow p-3 md:py-5 md:px-6">
                           <div className="head">
                              <h2 className="mb-3">
                                 <Typography
                                    fontFamily="primaryFont"
                                    text="secondary"
                                    weight="medium"
                                 >
                                    Revise Search
                                 </Typography>
                              </h2>
                           </div>
                           <MassachusettsMarriagesRefineSearch
                              width={""}
                              handleSubmitMassachusettsMarriages={handleSubmitMassachusettsMarriages}
                              massachusettsMarriageDefaultValues={values}
                              handleShowModal={handleShowUSModal}
                              buttonTitle="Update"
                           />
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/*Modal Tailwind Form*/}
            <TailwindModal
               title={contentCatalog?.collectionTitle}
               showClose={true}
               content={
                  <MassachusettsMarriagesSearchForm
                     inputWidth={""}
                     width={"sm:w-1/2"}
                     handleSubmitMassachusettsMarriages={handleSubmitMassachusettsMarriages}
                     defaultValues={valuesNew}
                     MMClear={false}
                     buttonTitle={buttonTitle}
                  />
               }
               showModal={showModal}
               setShowModal={setShowModal}
            />
         </div>
      </>
   );
};
export default SearchPageList;
