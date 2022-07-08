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
import WMLoader from "../../../../../components/Loader";
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
    getWashingtonMarriagesDefaultValue
} from "../../../../../utils";
import Table from "../../../Table";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import { ListingPageheaderContent, PaginationResult } from "../../../../../utils/search";
import { updateMarriagePlace } from "../../../utils/common";
import WashingtonMarriagesSearchForm from "../components/SearchForm";
import WashingtonMarriagesRefineSearch from "../components/RefineSearch";
import { getWMDropdownList, submitWMForm, clearWMFormQuery } from "../../../../../redux/actions/washintonMarriages";



const getValuesForm = (formValues) => {
    const _values = { ...formValues };
    let MarriagePlaceObj = updateMarriagePlace(_values);
    return {
        ..._values,
        ...MarriagePlaceObj,
        pn: _values?.pn,
        ps: _values?.ps,
    };
};
const setFormData = (setValues, _values, MarriagePlaceObj) => {
    setValues({
        ...mergeDeep(getWashingtonMarriagesDefaultValue(), _values),
        ps: getPageSize(_values.ps),
        Marriage: {
            id: _values?.m?.li?.i,
            name: _values?.m?.l?.l,
            ...(MarriagePlaceObj ? { levelData: MarriagePlaceObj } : {}),
        },
    });
};
const getData = async (search, history, setValues) => {
    if (search) {
        const _values = decodeDataToURL(search);
        let MarriagePlaceObj = null;
        if (_values?.m?.li?.i) {
            MarriagePlaceObj = await getLocationGUID(_values.m?.li?.i);
        }
        setFormData(setValues, _values, MarriagePlaceObj);
    } else {
        history.push("/search/washington-state-marriages");
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
    if (_values.Marriage) {
        delete _values.Marriage;
    }

    history.push(`?${encodeDataToURL({ ...formDataTrim(_values), pn: page })}`);
};

const SearchPageList = () => {
    
    const [values, setValues] = useState(null);
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [valuesNew, setValuesNew] = useState(null);
    const [tableColWidth, setTableColWidth] = useState([]);
    const [tableColTotal, setTableColTotal] = useState(0);
    const [tableSize, setTableSize] = useState(null);
    const newRequest = useRef(true);
    const [isPageLoad, setisPageLoad] = useState(true);
    


    const history = useHistory();
    const { WMPageTitle, totalRecords, maskingFields } = useSelector(
        (state) => {
            return state.washingtonMarriages;
        }
    );
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const getWMList = useCallback(
        (formValues = values) => {
            if (formValues !== null) {
                const _values = getValuesForm(formValues);
                dispatch(submitWMForm(_values, newRequest.current));
            }
            newRequest.current = false;
        },
        [dispatch, values, newRequest]
    );

    useEffect(() => {
        dispatch(getWMDropdownList()); //Dropdowns
      }, [dispatch]);

    useEffect(() => {
        getData(location.search, history, setValues);
    }, [setValues, location.search, history]);
    useEffect(() => {
        getWMList();
        return () => {
            let pathName = history.location.pathname;
            if (pathName !== "/search/washington-state-marriages/result" && pathName.split("/")?.[1] !== "records") {
                localStorage.removeItem('switch_status');
                dispatch(updateContentCatalog())
                dispatch(clearWMFormQuery())
            }
          }
    }, [dispatch,getWMList]);
    const handleSubmitWashingtonMarriages = (formValues) => {
        newRequest.current = true;
        setShowModal(false);
        genarateUrl(formValues, history);
    };
    const getWMListPage = (page) => {
        let data = { ...values, pn: page };
        genarateUrl(data, history, page);
        setisPageLoad(false);
    };
    const changeLimit = (pageLimit) => {
        let data = { ...values, pn: 1, ps: pageLimit };
        genarateUrl(data, history);
        setisPageLoad(false);
    };
    const { WMList, loading, WMPageLoading, error } = useSelector(
        (state) => state.washingtonMarriages
    );
  
    const WMPageRecords = useMemo(() => {
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
        let formValue = mergeDeep(getWashingtonMarriagesDefaultValue(), values);
        bool && setValuesNew(formValue);
        setShowModal(bool);
    };

    const handleTableColWidth = (width) => {
        setTableColWidth(width);
    };
    const handleTableColTotal = (width) => {
        setTableColTotal(width);
    };
    const getWMHTMLData = () => {
        if (loading) {
            return (
                <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
                    <div className="absolute top-50 z-50 top-2/4 left-2/4">
                        <WMLoader />
                    </div>
                </div>
            );
        } else {
            return WMList.length === 0 ? (
                <Norecords
                    searchResult={WMList}
                    isLoading={false}
                    firstName={getFirstName(values)}
                />
            ) : (
                <Table
                    tableSize={getTableSize}
                    handleTableColWidth={handleTableColWidth}
                    handleTableColTotal={handleTableColTotal}
                    data={WMList}
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
                {WMPageLoading ? (
                    <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
                        <div className="absolute top-50 z-50 top-2/4 left-2/4">
                            <WMLoader />
                        </div>
                    </div>
                ) : (
                    <div className="container mx-auto">
                        <div className="head w-full text-center mb-4">
                            {ListingPageheaderContent(WMPageTitle)}
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
                                {WMPageRecords !== 0 && (
                                    <p>
                                        <Typography
                                            fontFamily="primaryFont"
                                            size={14}
                                            text="secondary"
                                            weight="light"
                                        >
                                            {PaginationResult(
                                                t,
                                                WMPageRecords,
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
                                        {getWMHTMLData()}
                                    </div>
                                </div>
                                <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                                    <TWPaginationComponent
                                        currentPage={parseInt(values?.pn || 0)}
                                        totalRecords={totalRecords}
                                        limitPerPage={parseInt(values?.ps || 20)}
                                        getList={getWMListPage}
                                        changeLimit={changeLimit}
                                        tableSize={tableSize}
                                    />
                                </div>
                            </div>
                            <div
                                className={ClassNames("mb-8 sidebar-search hidden flex-col", {
                                    "sml:flex": !WMPageLoading && !loading,
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
                                    <WashingtonMarriagesRefineSearch
                                        width={""}
                                        handleSubmitWashingtonMarriages={handleSubmitWashingtonMarriages}
                                        WMDefaultValues={values}
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
                    title={WMPageTitle}
                    showClose={true}
                    content={
                        <WashingtonMarriagesSearchForm
                            inputWidth={""}
                            width={"sm:w-1/2"}
                            handleSubmitWashingtonMarriages={handleSubmitWashingtonMarriages}
                            defaultValues={valuesNew}
                            WMClear={false}
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
