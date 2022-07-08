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
import USFederalLoader from "../../../../../components/Loader";
import Typography from "../../../../../components/Typography";
import Button from "../../../../../components/Button";
import TWPaginationComponent from "../../../../../components/Pagination/TWPaginationComponent";
import TailwindModal from "../../../../../components/TailwindModal";
import {
    clearUsFederal1800FormQuery,
    submitUSFederal1800Form,
} from "../../../../../redux/actions/usFedral1800";
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
import USFederal1800Table from "../../../Table";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import USFederal1800SearchForm from "../components/SearchForm";
import USFederal1800RefineSearch from "../components/RefineSearch";
import { ListingPageheaderContent, PaginationResult } from "../../../../../utils/search";
import { updateResidenceField } from "../../../utils/common";



const getValuesForm = (formValues) => {
    const _values = { ...formValues };
    let ResidenceObj = updateResidenceField(_values);
    return {
        ..._values,
        ...ResidenceObj,
    };
};
const setFormData = (setValues, _values, ResidenceObj) => {
    setValues({
        ...mergeDeep(getUSFederal1800DefaultValues(), _values),
        Residence: {
            id: _values?.r?.li?.i,
            name: _values?.r?.l?.l,
            ...(ResidenceObj ? { levelData: ResidenceObj } : {}),
        },
        ps: getPageSize(_values.ps),
    });
};
const getData = async (search, history, setValues) => {
    if (search) {
        const _values = decodeDataToURL(search);
        let residenceObj = null;
        if (_values?.r?.li?.i) {
            residenceObj = await getLocationGUID(_values.r?.li?.i);
        }
        setFormData(setValues, _values, residenceObj);
    } else {
        history.push("/search/1800-united-states-federal-census");
    }
};
const genarateUrl = (formValues, history, page = 1) => {
    const usValues = { ...formValues };

    if (usValues.Residence) {
        delete usValues.Residence;
    }

    if (!usValues.fm.t) {
        delete usValues.fm;
    }
    if (!usValues.ln.t) {
        delete usValues.ln;
    }
    if (!usValues.matchExact) {
        delete usValues.matchExact;
    }
    history.push(`?${encodeDataToURL({ ...formDataTrim(usValues), pn: page })}`);
};

const SearchPageList = () => {

    const [isPageLoad, setisPageLoad] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [values, setValues] = useState(null);
    const [valuesNew, setValuesNew] = useState(null);
    const [tableSize, setTableSize] = useState(null);
    const location = useLocation();
    const newRequest = useRef(true);
    const [tableColTotal, setTableColTotal] = useState(0);
    const [tableColWidth, setTableColWidth] = useState([]);

    const history = useHistory();
    const {totalRecords, maskingFields } = useSelector(
        (state) => {
            return state.usFederal1800;
        }
    );
    const { contentCatalog } = useSelector((state) => {
        return state.sidebar;
    });
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const getUSFederal1800List = useCallback(
        (formValues = values) => {
            if (formValues !== null) {
                const _values = getValuesForm(formValues);
                dispatch(submitUSFederal1800Form(_values, newRequest.current));
            }
            newRequest.current = false;
        },
        [dispatch, values, newRequest]
    );

    useEffect(() => {
        getData(location.search, history, setValues);
    }, [setValues, location.search, history]);


    useEffect(() => {
        getUSFederal1800List();
        return () => {
            let pathName = history.location.pathname;
            if (pathName !== "/search/1800-united-states-federal-census/result" && pathName.split("/")?.[1] !== "records") {
                localStorage.removeItem('switch_status');
                dispatch(updateContentCatalog())
                dispatch(clearUsFederal1800FormQuery())
            }
         }

    }, [getUSFederal1800List]);


    const handleSubmitUSFederal1800 = (formValues) => {
        newRequest.current = true;
        setShowModal(false);
        genarateUrl(formValues, history);
    };
    const getUSFederal1800ListPage = (page) => {
        let data = { ...values, pn: page };
        genarateUrl(data, history, page);
        setisPageLoad(false);
    };
    const changeLimit = (pageLimit) => {
        let data = { ...values, pn: 1, ps: pageLimit };
        genarateUrl(data, history);
        setisPageLoad(false);
    };
    const { usFederal100List, loading, pageLoading, error } = useSelector(
        (state) => state.usFederal1800
    );

    const USFederal1800pageRecords = useMemo(() => {
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
    const getDeathsHTMLData = () => {
        if (loading) {
            return (
                <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
                    <div className="absolute top-50 z-50 top-2/4 left-2/4">
                        <USFederalLoader />
                    </div>
                </div>
            );
        } else {
            return usFederal100List.length === 0 ? (
                <Norecords
                    searchResult={usFederal100List}
                    isLoading={false}
                    firstName={getFirstName(values)}
                />
            ) : (
                <USFederal1800Table
                    tableSize={getTableSize}
                    handleTableColWidth={handleTableColWidth}
                    handleTableColTotal={handleTableColTotal}
                    data={usFederal100List}
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
                            <USFederalLoader />
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
                                </div>
                            </div>
                            <div>
                                {USFederal1800pageRecords !== 0 && (
                                    <p>
                                        <Typography
                                            fontFamily="primaryFont"
                                            size={14}
                                            text="secondary"
                                            weight="light"
                                        >
                                            {PaginationResult(
                                                t,
                                                USFederal1800pageRecords,
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
                                        getList={getUSFederal1800ListPage}
                                        tableSize={tableSize}
                                        totalRecords={totalRecords}
                                        changeLimit={changeLimit}
                                        limitPerPage={parseInt(values?.ps || 20)}
                                        currentPage={parseInt(values?.pn || 0)}
                                    />
                                </div>
                            </div>
                            <div className={ClassNames("mb-8 sidebar-search hidden flex-col", { "sml:flex": !pageLoading && !loading, })}>
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
                                    <USFederal1800RefineSearch
                                        width={""}
                                        handleSubmitUSFederal1800={handleSubmitUSFederal1800}
                                        usFederal1800DefaultValues={values}
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
                        <USFederal1800SearchForm
                            inputWidth={""}
                            width={"sm:w-1/2"}
                            handleSubmitUSFederal1800={handleSubmitUSFederal1800}
                            defaultValues={valuesNew}
                            USFClear={false}
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
