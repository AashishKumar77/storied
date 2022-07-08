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
import NYCLoader from "../../../../../components/Loader";
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
    getNYCDefaultValue
} from "../../../../../utils";
import Table from "../../../Table";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import NYCSearchForm from "../components/SearchForm";
import NYCRefineSearch from "../components/RefineSearch";
import { getNYCDropdownList, submitNYCForm, clearNYCFormQuery } from "../../../../../redux/actions/NYC";
import { PaginationResult } from "../../../../../utils/search";

const updateMarriagePlace = (_values) => {
    let obj = {};
    if (_values?.m?.li?.i) {
        const levelData = _values.Marriage.levelData;
        obj = {
            m: {
                li: {
                    i: levelData?.residenceId[levelData.residenceLevel[_values.m.li.s]],
                    s: _values.m.li.s,
                },
                l: {
                    l: _values.m.l.l,
                    s: _values.m.l.s,
                },
            },
        };
    } else if (_values?.m?.l?.l) {
        obj = {
            m: {
                l: {
                    l: _values.m.l.l,
                    s: _values.m.l.s,
                },
            },
        };
    } else {
        delete _values.m.li;
        delete _values.m.l;
    }
    if (_values.Marriage) {
        delete _values.Marriage;
    }
    return obj;
};

const getValuesForm = (formValues) => {
    const _values = { ...formValues };
    let marriageObj = updateMarriagePlace(_values);
    return {
        ..._values,
        ...marriageObj,
        pn: _values?.pn,
        ps: _values?.ps,
    };
};
const setFormData = (setValues, _values, MarriageObj) => {
    setValues({
        ...mergeDeep(getNYCDefaultValue(), _values),
        ps: getPageSize(_values.ps),
        Marriage: {
            id: _values?.m?.li?.i,
            name: _values?.m?.l?.l,
            ...(MarriageObj ? { levelData: MarriageObj } : {}),
        },
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
        history.push("/search/new-york-city-marriages");
    }
};


const genarateUrl = (formValues, history, page = 1) => {
    const _values = { ...formValues };

    if (_values.Marriage) {
        delete _values.Marriage;
    }

    if (!_values.fm.t) {
        delete _values.fm;
    }
    if (!_values.ln.t) {
        delete _values.ln;
    }
    if (!_values.matchExact) {
        delete _values.matchExact;
    }
    history.push(`?${encodeDataToURL({ ...formDataTrim(_values), pn: page })}`);
};

const SearchPageList = () => {
    
    const [values, setValues] = useState(null);
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const newRequest = useRef(true);
    const [isPageLoad, setisPageLoad] = useState(true);
    const [tableColWidth, setTableColWidth] = useState([]);
    const [valuesNew, setValuesNew] = useState(null);
    const [tableColTotal, setTableColTotal] = useState(0);
    const [tableSize, setTableSize] = useState(null);


    const history = useHistory();
    const { totalRecords, maskingFields } = useSelector(
        (state) => {
            return state.nyc;
        }
    );
    const { contentCatalog } = useSelector((state) => {
        return state.sidebar;
    });
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const getNYCList = useCallback(
        (formValues = values) => {
            if (formValues !== null) {
                const _values = getValuesForm(formValues);
                dispatch(submitNYCForm(_values, newRequest.current));
            }
            newRequest.current = false;
        },
        [dispatch, values, newRequest]
    );

    useEffect(() => {
        dispatch(getNYCDropdownList());
      }, [dispatch]);

    useEffect(() => {
        getData(location.search, history, setValues);
    }, [setValues, location.search, history]);
    useEffect(() => {
        getNYCList();
        return () => {
            let pathName = history.location.pathname;
            if (pathName !== "/search/new-york-city-marriages/result" && pathName.split("/")?.[1] !== "records") {
                localStorage.removeItem('switch_status');
                dispatch(updateContentCatalog())
                dispatch(clearNYCFormQuery())
            }
         }
    }, [dispatch,getNYCList]);
    const handleSubmitNYC = (formValues) => {
        newRequest.current = true;
        setShowModal(false);
        genarateUrl(formValues, history);
    };
    const getNYCListPage = (page) => {
        let data = { ...values, pn: page };
        genarateUrl(data, history, page);
        setisPageLoad(false);
    };
    const changeLimit = (pageLimit) => {
        let data = { ...values, pn: 1, ps: pageLimit };
        genarateUrl(data, history);
        setisPageLoad(false);
    };
    const { NYCList, loading, NYCPageLoading, error } = useSelector(
        (state) => state.nyc
    );
  
    const NYCPageRecords = useMemo(() => {
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

    const NYCHeaderContent = (title) => (
        <div className="head-content text-center">
            <h2 className="mb-5 sml:mb-1.5">
                <Typography
                    fontFamily="primaryFont"
                    size={24}
                    text="secondary"
                    weight="medium"
                >
                    {title}
                </Typography>
            </h2>
        </div>
    );
    const buttonTitle = getButtonTitle(values);
    const handleShowModalNew = (bool) => {
        handleShowModal(bool);
    };
    const getTableSize = (width) => {
        setTableSize(width);
    };
    const handleShowModal = (bool) => {
        let formValue = mergeDeep(getNYCDefaultValue(), values);
        bool && setValuesNew(formValue);
        setShowModal(bool);
    };

    const handleTableColWidth = (width) => {
        setTableColWidth(width);
    };
    const handleTableColTotal = (width) => {
        setTableColTotal(width);
    };
    const getNYCHTMLData = () => {
        if (loading) {
            return (
                <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
                    <div className="absolute top-50 z-50 top-2/4 left-2/4">
                        <NYCLoader />
                    </div>
                </div>
            );
        } else {
            return NYCList.length === 0 ? (
                <Norecords
                    searchResult={NYCList}
                    isLoading={false}
                    firstName={getFirstName(values)}
                />
            ) : (
                <Table
                    tableSize={getTableSize}
                    handleTableColWidth={handleTableColWidth}
                    handleTableColTotal={handleTableColTotal}
                    data={NYCList}
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
                {NYCPageLoading ? (
                    <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
                        <div className="absolute top-50 z-50 top-2/4 left-2/4">
                            <NYCLoader />
                        </div>
                    </div>
                ) : (
                    <div className="container mx-auto">
                        <div className="head w-full text-center mb-4">
                            {NYCHeaderContent(contentCatalog?.collectionTitle)}
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
                                {NYCPageRecords !== 0 && (
                                    <p>
                                        <Typography
                                            fontFamily="primaryFont"
                                            size={14}
                                            text="secondary"
                                            weight="light"
                                        >
                                            {PaginationResult(
                                                t,
                                                NYCPageRecords,
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
                                        {getNYCHTMLData()}
                                    </div>
                                </div>
                                <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                                    <TWPaginationComponent
                                        currentPage={parseInt(values?.pn || 0)}
                                        totalRecords={totalRecords}
                                        limitPerPage={parseInt(values?.ps || 20)}
                                        getList={getNYCListPage}
                                        changeLimit={changeLimit}
                                        tableSize={tableSize}
                                    />
                                </div>
                            </div>
                            <div
                                className={ClassNames("mb-8 sidebar-search hidden flex-col", {
                                    "sml:flex": !NYCPageLoading && !loading,
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
                                    <NYCRefineSearch
                                        width={""}
                                        handleSubmitNYC={handleSubmitNYC}
                                        NYCDefaultValues={values}
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
                        <NYCSearchForm
                            inputWidth={""}
                            width={"sm:w-1/2"}
                            handleSubmitNYC={handleSubmitNYC}
                            defaultValues={valuesNew}
                            NYCClear={false}
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
