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
import USCensusLoader from "../../../../../components/Loader";
import Typography from "../../../../../components/Typography";
import Button from "../../../../../components/Button";
import TWPaginationComponent from "../../../../../components/Pagination/TWPaginationComponent";
import TailwindModal from "../../../../../components/TailwindModal";
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
    getUSCensusDefaultValue
} from "../../../../../utils";
import USCensusTable from "../../../Table";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import { ListingPageheaderContent, PaginationResult } from "../../../../../utils/search";
import { getUSCensusDropdownList, submitUSCensusForm, clearUSCensusFormQuery } from "../../../../../redux/actions/USCensus";
import USCensusSearchForm from "../components/SearchForm";
import USCensusRefineSearch from "../components/RefineSearch";
import { updateResidencePlace } from "../../../utils/common";


const getValuesForm = (formValues) => {
    const _values = { ...formValues };
    let resObj = updateResidencePlace(_values);
    return {
        ..._values,
        ...resObj,
        pn: _values?.pn,
        ps: _values?.ps,
    };
};
const setFormData = (setValues, _values, resObj) => {
    setValues({
        ...mergeDeep(getUSCensusDefaultValue(), _values),
        ps: getPageSize(_values.ps),
        Res: {
            id: _values?.r?.li?.i,
            name: _values?.r?.l?.l,
            ...(resObj ? { levelData: resObj } : {}),
        },
    });
};
const getData = async (search, history, setValues) => {
    if (search) {
        const _values = decodeDataToURL(search);
        let resObj = null;
        if (_values?.r?.li?.i) {
            resObj = await getLocationGUID(_values.r?.li?.i);
        }
        setFormData(setValues, _values, resObj);
    } else {
        history.push("/search/1790-united-states-federal-census");
    }
};


const genarateUrl = (formValues, history, page = 1) => {
    const _values = { ...formValues };

    if (!_values.fm.t) {
        delete _values.fm;
    }
    if (!_values.ln.t) {
        delete _values.ln;
    }
    if (!_values.matchExact) {
        delete _values.matchExact;
    }

    //Residence

    if (_values.Res) {
        delete _values.Res;
    }

    history.push(`?${encodeDataToURL({ ...formDataTrim(_values), pn: page })}`);
};

const SearchPageList = () => {
    const location = useLocation();
    const [values, setValues] = useState(null);
    const [valuesNew, setValuesNew] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const newRequest = useRef(true);
    const [isPageLoad, setisPageLoad] = useState(true);
    const [tableSize, setTableSize] = useState(null);
    const [tableColWidth, setTableColWidth] = useState([]);
    const [tableColTotal, setTableColTotal] = useState(0);


    const history = useHistory();
    const { totalRecords, maskingFields } = useSelector(
        (state) => {
            return state.USCensus;
        }
    );
    const { contentCatalog } = useSelector((state) => {
        return state.sidebar;
      });
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const getUSCensusList = useCallback(
        (formValues = values) => {
            if (formValues !== null) {
                const _values = getValuesForm(formValues);
                dispatch(submitUSCensusForm(_values, newRequest.current));
            }
            newRequest.current = false;
        },
        [dispatch, values, newRequest]
    );

    useEffect(() => {
        dispatch(getUSCensusDropdownList()); //Dropdowns
      }, [dispatch]);

    useEffect(() => {
        getData(location.search, history, setValues);
    }, [setValues, location.search, history]);
    useEffect(() => {
        getUSCensusList();
        return () => {
            let pathName = history.location.pathname;
            if (pathName !== "/search/1790-united-states-federal-census/result" && pathName.split("/")?.[1] !== "records") {
                localStorage.removeItem('switch_status');
                dispatch(updateContentCatalog())
                dispatch(clearUSCensusFormQuery())
            }
          }
    }, [dispatch,getUSCensusList]);
    const handleSubmitUSCensus = (formValues) => {
        newRequest.current = true;
        setShowModal(false);
        genarateUrl(formValues, history);
    };
    const getUSCensusListPage = (page) => {
        let data = { ...values, pn: page };
        genarateUrl(data, history, page);
        setisPageLoad(false);
    };
    const changeLimit = (pageLimit) => {
        let data = { ...values, pn: 1, ps: pageLimit };
        genarateUrl(data, history);
        setisPageLoad(false);
    };
    const { USCensusList, loading, CensusPageLoading, error } = useSelector(
        (state) => state.USCensus
    );
  
    const USCensusPageRecords = useMemo(() => {
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
    const handleShowModalNew = (bool) => {
        handleShowModal(bool);
    };
    const getTableSize = (width) => {
        setTableSize(width);
    };
    const handleShowModal = (bool) => {
        let formValue = mergeDeep(getUSCensusDefaultValue(), values);
        bool && setValuesNew(formValue);
        setShowModal(bool);
    };

    const handleTableColWidth = (width) => {
        setTableColWidth(width);
    };
    const handleTableColTotal = (width) => {
        setTableColTotal(width);
    };
    const getUSCensusHtmlData = () => {
        if (loading) {
            return (
                <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
                    <div className="absolute top-50 z-50 top-2/4 left-2/4">
                        <USCensusLoader />
                    </div>
                </div>
            );
        } else {
            return USCensusList.length === 0 ? (
                <Norecords
                    searchResult={USCensusList}
                    isLoading={false}
                    firstName={getFirstName(values)}
                />
            ) : (
                <USCensusTable
                    tableSize={getTableSize}
                    handleTableColWidth={handleTableColWidth}
                    handleTableColTotal={handleTableColTotal}
                    data={USCensusList}
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
                {CensusPageLoading ? (
                    <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
                        <div className="absolute top-50 z-50 top-2/4 left-2/4">
                            <USCensusLoader />
                        </div>
                    </div>
                ) : (
                    <div className="container mx-auto">
                        <div className="head w-full text-center mb-4">
                            {ListingPageheaderContent(contentCatalog?.collectionTitle)}
                            <div className="edit-new-link-wrap text-center mb-5 sml:hidden">
                                <div className="links w-full flex justify-center">
                                    <Button
                                        handleClick={(e) => {
                                            handleShowModal(true);
                                            e.preventDefault();
                                        }}
                                        type="default"
                                        title="Edit Search"
                                    />
                                    <Button
                                        handleClick={(e) => {
                                            handleShowModalNew(true);
                                            e.preventDefault();
                                        }}
                                        title="New Search"
                                        type="default"
                                    />
                                </div>
                            </div>
                            <div>
                                {USCensusPageRecords !== 0 && (
                                    <p>
                                        <Typography
                                            fontFamily="primaryFont"
                                            size={14}
                                            text="secondary"
                                            weight="light"
                                        >
                                            {PaginationResult(
                                                t,
                                                USCensusPageRecords,
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
                                        {getUSCensusHtmlData()}
                                    </div>
                                </div>
                                <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                                    <TWPaginationComponent
                                        currentPage={parseInt(values?.pn || 0)}
                                        totalRecords={totalRecords}
                                        limitPerPage={parseInt(values?.ps || 20)}
                                        getList={getUSCensusListPage}
                                        changeLimit={changeLimit}
                                        tableSize={tableSize}
                                    />
                                </div>
                            </div>
                            <div
                                className={ClassNames("mb-8 sidebar-search hidden flex-col", {
                                    "sml:flex": !CensusPageLoading && !loading,
                                })}
                            >
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
                                    <USCensusRefineSearch
                                        width={""}
                                        handleSubmitUSCensus={handleSubmitUSCensus}
                                        defaultUSValues={values}
                                        handleShowModal={handleShowModal}
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
                        <USCensusSearchForm
                            inputWidth={""}
                            width={"sm:w-1/2"}
                            handleSubmitUSCensus={handleSubmitUSCensus}
                            defaultUSValues={valuesNew}
                            censusClear={false}
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
