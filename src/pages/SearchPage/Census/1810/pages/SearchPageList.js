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
import {
    clearUsFederal1810FormQuery,
    submitUSFederal1810Form,
} from "../../../../../redux/actions/usCensus1810";
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
    getUSFederal1800DefaultValues
} from "../../../../../utils";
import USFederal1810Table from "../../../Table";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import { ListingPageheaderContent, PaginationResult } from "../../../../../utils/search";
import { updateResidenceField } from "../../../utils/common";
import USCensus1810ReineSearch from "../components/RefineSearch";
import USCensus1810SearchForm from "../components/SearchForm";




const getValuesForm = (formValues) => {
    const _values = { ...formValues };
    let Residenceobj = updateResidenceField(_values);
    return {
        ..._values,
        ...Residenceobj,
    };
};
const setFormData = (setValues, _values, Residenceobj) => {
    setValues({
        ...mergeDeep(getUSFederal1800DefaultValues(), _values),
        Residence: {
            id: _values?.r?.li?.i,
            name: _values?.r?.l?.l,
            ...(Residenceobj ? { levelData: Residenceobj } : {}),
        },
        ps: getPageSize(_values.ps),
    });
};
const getData = async (search, history, setValues) => {
    if (search) {
        const _values = decodeDataToURL(search);
        let ResidenceObj = null;
        if (_values?.r?.li?.i) {
            ResidenceObj = await getLocationGUID(_values.r?.li?.i);
        }
        setFormData(setValues, _values, ResidenceObj);
    } else {
        history.push("/search/1810-united-states-federal-census");
    }
};
const genarateUrl = (formValues, history, page = 1) => {
    const _tmValues = { ...formValues };

    if (!_tmValues.fm.t) {
        delete _tmValues.fm;
    }
    if (!_tmValues.ln.t) {
        delete _tmValues.ln;
    }
    if (_tmValues.Residence) {
        delete _tmValues.Residence;
    }

    if (!_tmValues.matchExact) {
        delete _tmValues.matchExact;
    }
    history.push(`?${encodeDataToURL({ ...formDataTrim(_tmValues), pn: page })}`);
};

const SearchPageList = () => {
    const location = useLocation();
    const newRequest = useRef(true);
    const [isPageLoad, setisPageLoad] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [tableColTotal, setTableColTotal] = useState(0);
    const [tableColWidth, setTableColWidth] = useState([]);
    const [values, setValues] = useState(null);
    const [valuesNew, setValuesNew] = useState(null);
    const [tableSize, setTableSize] = useState(null);

    const history = useHistory();
    const {totalRecords, maskingFields } = useSelector(
        (state) => {
            return state.usCensus1810;
        }
    );
    const { contentCatalog } = useSelector((state) => {
        return state.sidebar;
    });
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const getUSFederal1810List = useCallback(
        (formValues = values) => {
            if (formValues !== null) {
                const _values = getValuesForm(formValues);
                dispatch(submitUSFederal1810Form(_values, newRequest.current));
            }
            newRequest.current = false;
        },
        [dispatch, values, newRequest]
    );

    useEffect(() => {
        getData(location.search, history, setValues);
    }, [setValues, location.search, history]);

    useEffect(() => {
        getUSFederal1810List();
        return () => {
            let pathName = history.location.pathname;
            if (pathName !== "/search/1810-united-states-federal-census/result" && pathName.split("/")?.[1] !== "records") {
                localStorage.removeItem('switch_status');
                dispatch(updateContentCatalog())
                dispatch(clearUsFederal1810FormQuery())
            }
         }
    }, [dispatch , getUSFederal1810List]);

    const handleSubmitUSCensus1810 = (formValues) => {
        newRequest.current = true;
        setShowModal(false);
        genarateUrl(formValues, history);
    };
    const getUSFederal1810ListPage = (page) => {
        let data = { ...values, pn: page };
        genarateUrl(data, history, page);
        setisPageLoad(false);
    };
    const changeLimit = (pageLimit) => {
        let data = { ...values, pn: 1, ps: pageLimit };
        genarateUrl(data, history);
        setisPageLoad(false);
    };
    const { usFederal1810List, loading, USCpageLoading, error } = useSelector(
        (state) => state.usCensus1810
    );

    const USFederal1810pageRecords = useMemo(() => {
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
    const handleUSCShowModalNew = (bool) => {
        handleUSCShowModal(bool);
    };
    const getTableSize = (width) => {
        setTableSize(width);
    };
    const handleUSCShowModal = (bool) => {
        let formValue = mergeDeep(getUSFederal1800DefaultValues(), values);
        bool && setValuesNew(formValue);
        setShowModal(bool);
    };

    const handleTableColWidth = (width) => {
        setTableColWidth(width);
    };
    const handleTableColTotal = (width) => {
        setTableColTotal(width);
    };
    const getUSCensusHTMLData = () => {
        if (loading) {
            return (
                <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
                    <div className="absolute top-50 z-50 top-2/4 left-2/4">
                        <USCensusLoader />
                    </div>
                </div>
            );
        } else {
            return usFederal1810List.length === 0 ? (
                <Norecords
                    searchResult={usFederal1810List}
                    isLoading={false}
                    firstName={getFirstName(values)}
                />
            ) : (
                <USFederal1810Table
                    tableSize={getTableSize}
                    handleTableColWidth={handleTableColWidth}
                    handleTableColTotal={handleTableColTotal}
                    data={usFederal1810List}
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
                {USCpageLoading ? (
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
                                            e.preventDefault();
                                            handleUSCShowModal(true);
                                        }}
                                        type="default"
                                        title="Edit Search"
                                    />
                                    <Button
                                        handleClick={(e) => {
                                            e.preventDefault();
                                            handleUSCShowModalNew(true);
                                        }}
                                        type="default"
                                        title="New Search"
                                    />
                                </div>
                            </div>
                            <div>
                                {USFederal1810pageRecords !== 0 && (
                                    <p>
                                        <Typography
                                            fontFamily="primaryFont"
                                            size={14}
                                            text="secondary"
                                            weight="light"
                                        >
                                            {PaginationResult(
                                                t,
                                                USFederal1810pageRecords,
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
                                        {getUSCensusHTMLData()}
                                    </div>
                                </div>
                                <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                                    <TWPaginationComponent
                                        getList={getUSFederal1810ListPage}
                                        tableSize={tableSize}
                                        totalRecords={totalRecords}
                                        changeLimit={changeLimit}
                                        limitPerPage={parseInt(values?.ps || 20)}
                                        currentPage={parseInt(values?.pn || 0)}
                                    />
                                </div>
                            </div>
                            <div className={ClassNames("mb-8 sidebar-search hidden flex-col", { "sml:flex": !USCpageLoading && !loading, })}>
                                <div className="bg-white sm:rounded-lg shadow p-3 md:py-5 md:px-6">
                                    <div className="head">
                                        <h2 className="mb-3">
                                            <Typography
                                                weight="medium"
                                                text="secondary"
                                                fontFamily="primaryFont"
                                            >
                                                Revise Search
                                            </Typography>
                                        </h2>
                                    </div>
                                    <USCensus1810ReineSearch
                                        width={""}
                                        handleSubmitUSCensus1810={handleSubmitUSCensus1810}
                                        usFederal1810DefaultValues={values}
                                        handleShowModal={handleUSCShowModal}
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
                        <USCensus1810SearchForm
                            inputWidth={""}
                            width={"sm:w-1/2"}
                            handleSubmitUSCensus1810={handleSubmitUSCensus1810}
                            defaultValues={valuesNew}
                            USCClear={false}
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
