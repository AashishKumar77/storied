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
import Loader from "../../../../../components/Loader";
import Typography from "../../../../../components/Typography";
import Button from "../../../../../components/Button";
import TWPaginationComponent from "../../../../../components/Pagination/TWPaginationComponent";
import TailwindModal from "../../../../../components/TailwindModal";
import {
    submitUSSocialSecurityForm,
    clearIUSSocialFormQuery
} from "../../../../../redux/actions/USSocialSecurity";
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
    getUSSocialSecurityDefaultValue,
} from "../../../../../utils";
import USSocialTable from "../../../Table";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import USSocialSecurityRefineSearch from "../components/RefineSearch";
import USSocialSecuritySearchForm from "../components/SearchForm";
import { ListingPageheaderContent, PaginationResult } from "../../../../../utils/search";
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
const setFormData = (setValues, _values, ResObj) => {
    setValues({
        ...mergeDeep(getUSSocialSecurityDefaultValue(), _values),
        ps: getPageSize(_values.ps),
        Res: {
            id: _values?.r?.li?.i,
            name: _values?.r?.l?.l,
            ...(ResObj ? { levelData: ResObj } : {}),
        },
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
        history.push("/search/united-states-social-security-death-index");
    }
};
const genarateUrl = (formValues, history, page = 1) => {
    const _values = { ...formValues };

    if (_values.Res) {
        delete _values.Res;
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
    const newRequest = useRef(true);
    const [valuesNew, setValuesNew] = useState(null);
    const [values, setValues] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [tableSize, setTableSize] = useState(null);
    const [isPageLoad, setisPageLoad] = useState(true);
    const [tableColWidth, setTableColWidth] = useState([]);
    const [tableColTotal, setTableColTotal] = useState(0);
    const history = useHistory();
    const { totalRecords, maskingFields } = useSelector(
        (state) => {
            return state.USSocialSecurity;
        }
    );
    const { contentCatalog } = useSelector((state) => {
        return state.sidebar;
      });
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const getUSSocialList = useCallback(
        (formValues = values) => {
            if (formValues !== null) {
                const _values = getValuesForm(formValues);
                dispatch(submitUSSocialSecurityForm(_values, newRequest.current));
            }
            newRequest.current = false;
        },
        [dispatch, values, newRequest]
    );

    useEffect(() => {
        getData(location.search, history, setValues);
    }, [setValues, location.search, history]);
    useEffect(() => {
        getUSSocialList();
        return () => {
            let pathName = history.location.pathname;
            if (pathName !== "/search/united-states-social-security-death-index/result" && pathName.split("/")?.[1] !== "records") {
             localStorage.removeItem('switch_status');
             dispatch(updateContentCatalog())
             dispatch(clearIUSSocialFormQuery())
            }
          }
    }, [dispatch,getUSSocialList]);
    const handleSubmitUSSocialSecurity = (formValues) => {
        newRequest.current = true;
        setShowModal(false);
        genarateUrl(formValues, history);
    };
    const getUSSocialListPage = (page) => {
        let data = { ...values, pn: page };
        genarateUrl(data, history, page);
        setisPageLoad(false);
    };
    const changeLimit = (pageLimit) => {
        let data = { ...values, pn: 1, ps: pageLimit };
        genarateUrl(data, history);
        setisPageLoad(false);
    };
    const { USSocialList, loading, pageLoading, error } = useSelector(
        (state) => state.USSocialSecurity
    );
    useEffect(() => {
        dispatch(ssdi({}));
    }, [dispatch]);

    const USSocialPageRecords = useMemo(() => {
        return pageRecordsCountfn(
            loading,
            error,
            totalRecords,
            values?.ps,
            values?.pn
        );
    }, [loading, error, totalRecords, values]);

    const buttonTitle = getButtonTitle(values);

    const handleShowUSSocialModal = (bool) => {
        let formValue = mergeDeep(getUSSocialSecurityDefaultValue(), values);
        bool && setValuesNew(formValue);
        setShowModal(bool);
    };

    const handleShowUSSocialModalNew = (bool) => {
        handleShowUSSocialModal(bool);
    };
    const getTableSize = (width) => {
        setTableSize(width);
    };

    const handleTableColWidth = (width) => {
        setTableColWidth(width);
    };
    const handleTableColTotal = (width) => {
        setTableColTotal(width);
    };
    const getUSSocialHtmlData = () => {
        if (loading) {
            return (
                <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
                    <div className="absolute top-50 z-50 top-2/4 left-2/4">
                        <Loader />
                    </div>
                </div>
            );
        } else {
            return USSocialList.length === 0 ? (
                <Norecords
                    searchResult={USSocialList}
                    isLoading={false}
                    firstName={getFirstName(values)}
                />
            ) : (
                <USSocialTable
                    data={USSocialList}
                    maskingFields={maskingFields}
                    error={error}
                    loading={loading}
                    isPageLoad={isPageLoad}
                    tableColWidth={tableColWidth}
                    tableColTotal={tableColTotal}
                    tableSize={getTableSize}
                    handleTableColWidth={handleTableColWidth}
                    handleTableColTotal={handleTableColTotal}
                />
            );
        }
    };
    return (
        <>
            <div className="page-wrap ww-results-wrap" id="us-social-form">
                {pageLoading ? (
                    <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
                        <div className="absolute top-50 z-50 top-2/4 left-2/4">
                            <Loader />
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
                                            handleShowUSSocialModal(true);
                                        }}
                                        title="Edit Search"
                                        type="default"
                                    />
                                    <Button
                                        handleClick={(e) => {
                                            e.preventDefault();
                                            handleShowUSSocialModalNew(true);
                                        }}
                                        title="New Search"
                                        type="default"
                                    />
                                </div>
                            </div>
                            <div>
                                {USSocialPageRecords !== 0 && (
                                    <p>
                                        <Typography
                                            fontFamily="primaryFont"
                                            size={14}
                                            text="secondary"
                                            weight="light"
                                        >
                                            {PaginationResult(
                                                t,
                                                USSocialPageRecords,
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
                                        {getUSSocialHtmlData()}
                                    </div>
                                </div>
                                <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                                    <TWPaginationComponent
                                        currentPage={parseInt(values?.pn || 0)}
                                        totalRecords={totalRecords}
                                        limitPerPage={parseInt(values?.ps || 20)}
                                        getList={getUSSocialListPage}
                                        changeLimit={changeLimit}
                                        tableSize={tableSize}
                                    />
                                </div>
                            </div>
                            <div
                                className={ClassNames("mb-8 sidebar-search hidden flex-col", {
                                    "sml:flex": !pageLoading && !loading,
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
                                    <USSocialSecurityRefineSearch
                                        width={""}
                                        handleSubmitUSSocialSecurity={handleSubmitUSSocialSecurity}
                                        USSocialDefaultValues={values}
                                        handleShowModal={handleShowUSSocialModal}
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
                        <USSocialSecuritySearchForm
                            inputWidth={""}
                            width={"sm:w-1/2"}
                            handleSubmitUSSocialSecurity={handleSubmitUSSocialSecurity}
                            defaultValues={valuesNew}
                            USClear={false}
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
