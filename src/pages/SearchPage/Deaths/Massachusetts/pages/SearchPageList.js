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
import MassaChussetsLoader from "../../../../../components/Loader";
import Typography from "../../../../../components/Typography";
import Button from "../../../../../components/Button";
import TWPaginationComponent from "../../../../../components/Pagination/TWPaginationComponent";
import TailwindModal from "../../../../../components/TailwindModal";
import {
    submitMassachusettsForm,
    clearMassachussetsFormQuery
} from "../../../../../redux/actions/massachusetts";
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
    getMassachusettsDefaultValue
} from "../../../../../utils";
import MassachusettsTable from "../../../Table";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import MassachusettsSearchForm from "../components/SearchForm";
import MassachusettRefineSearch from "../components/RefineSearch";
import { ListingPageheaderContent, PaginationResult } from "../../../../../utils/search";
import { updateDeathPlace } from "../../../utils/common";



const getValuesForm = (formValues) => {
    const _values = { ...formValues };
    let deathObj = updateDeathPlace(_values);
    return {
        ..._values,
        ...deathObj,
        pn: _values?.pn,
        ps: _values?.ps,
    };
};
const setFormData = (setValues, _values, DeathObj) => {
    setValues({
        ...mergeDeep(getMassachusettsDefaultValue(), _values),
        ps: getPageSize(_values.ps),
        Death: {
            id: _values?.d?.li?.i,
            name: _values?.d?.l?.l,
            ...(DeathObj ? { levelData: DeathObj } : {}),
        },
    });
};
const getData = async (search, history, setValues) => {
    if (search) {
        const _values = decodeDataToURL(search);
        let DeathObj = null;
        if (_values?.d?.li?.i) {
            DeathObj = await getLocationGUID(_values.d?.li?.i);
        }
        setFormData(setValues, _values, DeathObj);
    } else {
        history.push("/search/massachusetts-state-deaths");
    }
};
const genarateUrl = (formValues, history, page = 1) => {
    const _values = { ...formValues };

    if (_values.Death) {
        delete _values.Death;
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
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const newRequest = useRef(true);
    const [values, setValues] = useState(null);
    const [tableColWidth, setTableColWidth] = useState([]);
    const [valuesNew, setValuesNew] = useState(null);
    const [tableColTotal, setTableColTotal] = useState(0);
    const [tableSize, setTableSize] = useState(null);
    const [isPageLoad, setisPageLoad] = useState(true);

    const history = useHistory();
    const { totalRecords, maskingFields } = useSelector(
        (state) => {
            return state.massachussets;
        }
    );
    const { contentCatalog } = useSelector((state) => {
        return state.sidebar;
      });
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const getMassachussetsList = useCallback(
        (formValues = values) => {
            if (formValues !== null) {
                const _values = getValuesForm(formValues);
                dispatch(submitMassachusettsForm(_values, newRequest.current));
            }
            newRequest.current = false;
        },
        [dispatch, values, newRequest]
    );

    useEffect(() => {
        getData(location.search, history, setValues);
    }, [setValues, location.search, history]);
    useEffect(() => {
        getMassachussetsList();
        return () => {
            let pathName = history.location.pathname;
            if (pathName !== "/search/massachusetts-state-deaths/result" && pathName.split("/")?.[1] !== "records") {
                localStorage.removeItem('switch_status');
                dispatch(updateContentCatalog())
                dispatch(clearMassachussetsFormQuery())
            }
        }
    }, [dispatch,getMassachussetsList]);
    const handleSubmitMassachusetts = (formValues) => {
        newRequest.current = true;
        setShowModal(false);
        genarateUrl(formValues, history);
    };
    const getMassachussetsListPage = (page) => {
        let data = { ...values, pn: page };
        genarateUrl(data, history, page);
        setisPageLoad(false);
    };
    const changeLimit = (pageLimit) => {
        let data = { ...values, pn: 1, ps: pageLimit };
        genarateUrl(data, history);
        setisPageLoad(false);
    };
    const { massachussetsList, loading, DeathsPageLoading, error } = useSelector(
        (state) => state.massachussets
    );
  
    const MassachusettspageRecords = useMemo(() => {
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
        let formValue = mergeDeep(getMassachusettsDefaultValue(), values);
        bool && setValuesNew(formValue);
        setShowModal(bool);
    };

    const handleTableColWidth = (width) => {
        setTableColWidth(width);
    };
    const handleTableColTotal = (width) => {
        setTableColTotal(width);
    };
    const getDeathsHTMLData = () => {
        if (loading) {
            return (
                <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
                    <div className="absolute top-50 z-50 top-2/4 left-2/4">
                        <MassaChussetsLoader />
                    </div>
                </div>
            );
        } else {
            return massachussetsList.length === 0 ? (
                <Norecords
                    searchResult={massachussetsList}
                    isLoading={false}
                    firstName={getFirstName(values)}
                />
            ) : (
                <MassachusettsTable
                    tableSize={getTableSize}
                    handleTableColWidth={handleTableColWidth}
                    handleTableColTotal={handleTableColTotal}
                    data={massachussetsList}
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
            <div className="page-wrap ww-results-wrap" id="massachusetts-form">
                {DeathsPageLoading ? (
                    <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
                        <div className="absolute top-50 z-50 top-2/4 left-2/4">
                            <MassaChussetsLoader />
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
                                            handleShowModal(true);
                                        }}
                                        type="default"
                                        title="Edit Search"
                                    />
                                    <Button
                                        handleClick={(e) => {
                                            e.preventDefault();
                                            handleShowModalNew(true);
                                        }}
                                        type="default"
                                        title="New Search"
                                    />
                                </div>
                            </div>
                            <div>
                                {MassachusettspageRecords !== 0 && (
                                    <p>
                                        <Typography
                                            fontFamily="primaryFont"
                                            size={14}
                                            text="secondary"
                                            weight="light"
                                        >
                                            {PaginationResult(
                                                t,
                                                MassachusettspageRecords,
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
                                        currentPage={parseInt(values?.pn || 0)}
                                        totalRecords={totalRecords}
                                        limitPerPage={parseInt(values?.ps || 20)}
                                        getList={getMassachussetsListPage}
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
                                    <MassachusettRefineSearch
                                        width={""}
                                        handleSubmitMassachusetts={handleSubmitMassachusetts}
                                        massachusettsDefaultValues={values}
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
                        <MassachusettsSearchForm
                            inputWidth={""}
                            width={"sm:w-1/2"}
                            handleSubmitMassachusetts={handleSubmitMassachusetts}
                            defaultValues={valuesNew}
                            MasClear={false}
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
