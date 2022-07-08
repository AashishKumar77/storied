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
    clearUsFederal1820FormQuery,
    submitUSFederal1820Form,
} from "../../../../../redux/actions/usCensus1820";
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
import USFederal1820Table from "../../../Table";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import { ListingPageheaderContent, PaginationResult } from "../../../../../utils/search";
import { updateResidenceField } from "../../../utils/common";
import USCensus1820ReineSearch from "../components/RefineSearch";
import USCensus1820SearchForm from "../components/SearchForm";




const getValuesForm = (formValues) => {
    const values = { ...formValues };
    let Residenceobj = updateResidenceField(values);
    return {
        ...values,
        ...Residenceobj,
    };
};
const setFormData = (setValues, _formvalues, Residenceobj) => {
    setValues({
        ...mergeDeep(getUSFederal1800DefaultValues(), _formvalues),
        Residence: {
            id: _formvalues?.r?.li?.i,
            name: _formvalues?.r?.l?.l,
            ...(Residenceobj ? { levelData: Residenceobj } : {}),
        },
        ps: getPageSize(_formvalues.ps),
    });
};
const getData = async (search, history, setValues) => {
    if (search) {
        const _values = decodeDataToURL(search);
        let ResObj = null;
        if (_values?.r?.li?.i) {
            ResObj = await getLocationGUID(_values.r?.li?.i);
        }
        setFormData(setValues, _values, ResObj);
    } else {
        history.push("/search/1820-united-states-federal-census");
    }
};
const genarateUrl = (formValues, history, page = 1) => {
    const _USValues = { ...formValues };

    if (!_USValues.fm.t) {
        delete _USValues.fm;
    }
    if (!_USValues.ln.t) {
        delete _USValues.ln;
    }
    if (_USValues.Residence) {
        delete _USValues.Residence;
    }

    if (!_USValues.matchExact) {
        delete _USValues.matchExact;
    }
    history.push(`?${encodeDataToURL({ ...formDataTrim(_USValues), pn: page })}`);
};

const SearchPageList = () => {


    const newRequest = useRef(true);
    const location = useLocation();
    const [tableColTotal, setTableColTotal] = useState(0);
    const [tableColWidth, setTableColWidth] = useState([]);
    const [isPageLoad, setisPageLoad] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [values, setValues] = useState(null);
    const [valuesNew, setValuesNew] = useState(null);
    const [tableSize, setTableSize] = useState(null);

    

    const history = useHistory();
    
    const {totalRecords, maskingFields } = useSelector(
        (state) => {
            return state.usCensus1820;
        }
    );
    const { contentCatalog } = useSelector((state) => {
        return state.sidebar;
    });
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const getUSFederal1820List = useCallback(
        (formValues = values) => {
            if (formValues !== null) {
                const _values = getValuesForm(formValues);
                dispatch(submitUSFederal1820Form(_values, newRequest.current));
            }
            newRequest.current = false;
        },
        [dispatch, values, newRequest]
    );

    useEffect(() => {
        getData(location.search, history, setValues);
    }, [setValues, location.search, history]);

    useEffect(() => {
        getUSFederal1820List();
        return () => {
            let pathName = history.location.pathname;
            if (pathName !== "/search/1820-united-states-federal-census/result" && pathName.split("/")?.[1] !== "records") {
                localStorage.removeItem('switch_status');
                dispatch(updateContentCatalog())
                dispatch(clearUsFederal1820FormQuery())
            }
         }
    }, [dispatch , getUSFederal1820List]);

    const handleSubmitUSCensus1820 = (formValues) => {
        newRequest.current = true;
        setShowModal(false);
        genarateUrl(formValues, history);
    };
    const getUSFederal1820ListPage = (page) => {
        let data = { ...values, pn: page };
        genarateUrl(data, history, page);
        setisPageLoad(false);
    };
    const changeLimit = (pageLimit) => {
        let data = { ...values, pn: 1, ps: pageLimit };
        genarateUrl(data, history);
        setisPageLoad(false);
    };
    const { usFederal1820List, loading, UFCpageLoading, error } = useSelector(
        (state) => state.usCensus1820
    );

    const USFederal1820pageRecords = useMemo(() => {
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
    const handleUFCShowModalNew = (bool) => {
        handleUFCShowModal(bool);
    };
    const getTableSize = (width) => {
        setTableSize(width);
    };
    const handleUFCShowModal = (bool) => {
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
            return usFederal1820List.length === 0 ? (
                <Norecords
                    searchResult={usFederal1820List}
                    isLoading={false}
                    firstName={getFirstName(values)}
                />
            ) : (
                <USFederal1820Table
                    tableSize={getTableSize}
                    handleTableColWidth={handleTableColWidth}
                    handleTableColTotal={handleTableColTotal}
                    data={usFederal1820List}
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
                {UFCpageLoading ? (
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
                                            handleUFCShowModal(true);
                                        }}
                                        type="default"
                                        title="Edit Search"
                                    />
                                    <Button
                                        handleClick={(e) => {
                                            e.preventDefault();
                                            handleUFCShowModalNew(true);
                                        }}
                                        type="default"
                                        title="New Search"
                                    />
                                </div>
                            </div>
                            <div>
                                {USFederal1820pageRecords !== 0 && (
                                    <p>
                                        <Typography
                                            fontFamily="primaryFont"
                                            size={14}
                                            text="secondary"
                                            weight="light"
                                        >
                                            {PaginationResult(
                                                t,
                                                USFederal1820pageRecords,
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
                                        getList={getUSFederal1820ListPage}
                                        tableSize={tableSize}
                                        totalRecords={totalRecords}
                                        changeLimit={changeLimit}
                                        limitPerPage={parseInt(values?.ps || 20)}
                                        currentPage={parseInt(values?.pn || 0)}
                                    />
                                </div>
                            </div>
                            <div className={ClassNames("mb-8 sidebar-search hidden flex-col", { "sml:flex": !UFCpageLoading && !loading, })}>
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
                                    <USCensus1820ReineSearch
                                        width={""}
                                        handleSubmitUSCensus1820={handleSubmitUSCensus1820}
                                        usFederal1820DefaultValues={values}
                                        handleShowModal={handleUFCShowModal}
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
                        <USCensus1820SearchForm
                            inputWidth={""}
                            width={"sm:w-1/2"}
                            handleSubmitUSCensus1820={handleSubmitUSCensus1820}
                            defaultValues={valuesNew}
                            UFCClear={false}
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
