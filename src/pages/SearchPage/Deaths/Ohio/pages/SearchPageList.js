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
import OhioLoader from "../../../../../components/Loader";
import Typography from "../../../../../components/Typography";
import Button from "../../../../../components/Button";
import TWPaginationComponent from "../../../../../components/Pagination/TWPaginationComponent";
import TailwindModal from "../../../../../components/TailwindModal";
import {
    submitOhioForm,
    clearOhioFormQuery
} from "../../../../../redux/actions/ohioDeaths";
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
    getOhioDeathsDefaultValue,
} from "../../../../../utils";
import OhioDeathsTable from "../../../Table";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import OhioSearchForm from "../components/SearchForm";
import OhioRefineSearch from "../components/RefineSearch";
import { ListingPageheaderContent, PaginationResult } from "../../../../../utils/search";
import { updateDeathPlace } from "../../../utils/common";



const getValuesForm = (formValues) => {
    const _ohioValues = { ...formValues };
    let deathObj = updateDeathPlace(_ohioValues);
    return {
        ..._ohioValues,
        ...deathObj,
        pn: _ohioValues?.pn,
        ps: _ohioValues?.ps,
    };
};
const setFormData = (setValues, _ohioValues, DeathObj) => {
    setValues({
        ...mergeDeep(getOhioDeathsDefaultValue(), _ohioValues),
        ps: getPageSize(_ohioValues.ps),
        Death: {
            id: _ohioValues?.d?.li?.i,
            name: _ohioValues?.d?.l?.l,
            ...(DeathObj ? { levelData: DeathObj } : {}),
        },
    });
};
const getData = async (search, history, setValues) => {
    if (search) {
        const _ohioValues = decodeDataToURL(search);
        let DeathObj = null;
        if (_ohioValues?.d?.li?.i) {
            DeathObj = await getLocationGUID(_ohioValues.d?.li?.i);
        }
        setFormData(setValues, _ohioValues, DeathObj);
    } else {
        history.push("/search/ohio-state-deaths");
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

    if (_values.Death) {
        delete _values.Death;
    }

    if (!_values.matchExact) {
        delete _values.matchExact;
    }
    history.push(`?${encodeDataToURL({ ...formDataTrim(_values), pn: page })}`);
};

const SearchPageList = () => {
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const newRequest = useRef(true);
    const [values, setValues] = useState(null);
    const [tableColWidth, setTableColWidth] = useState([]);
    const [tableSize, setTableSize] = useState(null);
    const [isPageLoad, setisPageLoad] = useState(true);
    const [valuesNew, setValuesNew] = useState(null);
    const [tableColTotal, setTableColTotal] = useState(0);

    const history = useHistory();
    const { totalRecords, maskingFields } = useSelector(
        (state) => {
            return state.ohioDeaths;
        }
    );
    const { contentCatalog } = useSelector((state) => {
        return state.sidebar;
      });
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const getOhioList = useCallback(
        (formValues = values) => {
            if (formValues !== null) {
                const _values = getValuesForm(formValues);
                dispatch(submitOhioForm(_values, newRequest.current));
            }
            newRequest.current = false;
        },
        [dispatch, values, newRequest]
    );

    useEffect(() => {
        getData(location.search, history, setValues);
    }, [setValues, location.search, history]);
    useEffect(() => {
        getOhioList();
        return () => {
            let pathName = history.location.pathname;
            if (pathName !== "/search/ohio-state-deaths/result" && pathName.split("/")?.[1] !== "records") {
                localStorage.removeItem('switch_status');
                dispatch(updateContentCatalog())
                dispatch(clearOhioFormQuery())
            }
        }
    }, [dispatch,getOhioList]);
    const handleSubmitOhio = (formValues) => {
        newRequest.current = true;
        setShowModal(false);
        genarateUrl(formValues, history);
    };
    const getOhioListPage = (page) => {
        let data = { ...values, pn: page };
        genarateUrl(data, history, page);
        setisPageLoad(false);
    };
    const changeLimit = (pageLimit) => {
        let data = { ...values, pn: 1, ps: pageLimit };
        genarateUrl(data, history);
        setisPageLoad(false);
    };
    const { ohioList, loading, DeathsPageLoading, error } = useSelector(
        (state) => state.ohioDeaths
    );
  
    const OhioDeathspageRecords = useMemo(() => {
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
    const handleOhioShowModalNew = (bool) => {
        handleOhioShowModal(bool);
    };
    const getTableSize = (width) => {
        setTableSize(width);
    };
    const handleOhioShowModal = (bool) => {
        let formValue = mergeDeep(getOhioDeathsDefaultValue(), values);
        bool && setValuesNew(formValue);
        setShowModal(bool);
    };

    const handleTableColWidth = (width) => {
        setTableColWidth(width);
    };
    const handleTableColTotal = (width) => {
        setTableColTotal(width);
    };
    const getOhioDeathsHTMLData = () => {
        if (loading) {
            return (
                <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
                    <div className="absolute top-50 z-50 top-2/4 left-2/4">
                        <OhioLoader />
                    </div>
                </div>
            );
        } else {
            return ohioList.length === 0 ? (
                <Norecords
                    searchResult={ohioList}
                    isLoading={false}
                    firstName={getFirstName(values)}
                />
            ) : (
                <OhioDeathsTable
                    tableSize={getTableSize}
                    handleTableColWidth={handleTableColWidth}
                    handleTableColTotal={handleTableColTotal}
                    data={ohioList}
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
            <div className="page-wrap ww-results-wrap" id="ohio-deaths-form">
                {DeathsPageLoading ? (
                    <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
                        <div className="absolute top-50 z-50 top-2/4 left-2/4">
                            <OhioLoader />
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
                                            e.preventDefault();
                                            handleOhioShowModal(true);
                                        }}
                                        type="default"
                                        title="Edit Search"
                                    />
                                    <Button
                                        handleClick={(e) => {
                                            e.preventDefault();
                                            handleOhioShowModalNew(true);
                                        }}
                                        type="default"
                                        title="New Search"
                                    />
                                </div>
                            </div>
                            <div>
                                {OhioDeathspageRecords !== 0 && (
                                    <p>
                                        <Typography
                                            fontFamily="primaryFont"
                                            size={14}
                                            text="secondary"
                                            weight="light"
                                        >
                                            {PaginationResult(
                                                t,
                                                OhioDeathspageRecords,
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
                                        {getOhioDeathsHTMLData()}
                                    </div>
                                </div>
                                <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                                    <TWPaginationComponent
                                        currentPage={parseInt(values?.pn || 0)}
                                        totalRecords={totalRecords}
                                        limitPerPage={parseInt(values?.ps || 20)}
                                        getList={getOhioListPage}
                                        changeLimit={changeLimit}
                                        tableSize={tableSize}
                                    />
                                </div>
                            </div>
                            <div
                                className={ClassNames("mb-8 sidebar-search hidden flex-col", {
                                    "sml:flex": !DeathsPageLoading && !loading,
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
                                    <OhioRefineSearch
                                        width={""}
                                        handleSubmitOhio={handleSubmitOhio}
                                        ohioDefaultValues={values}
                                        handleShowModal={handleOhioShowModal}
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
                        <OhioSearchForm
                            inputWidth={""}
                            width={"sm:w-1/2"}
                            handleSubmitOhio={handleSubmitOhio}
                            defaultValues={valuesNew}
                            OhioClear={false}
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
