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
import TexasMarriagesLoader from "../../../../../components/Loader";
import Typography from "../../../../../components/Typography";
import Button from "../../../../../components/Button";
import TWPaginationComponent from "../../../../../components/Pagination/TWPaginationComponent";
import TailwindModal from "../../../../../components/TailwindModal";
import {
    submitTexasMarriagesForm,
    clearTexasMarriagesFormQuery
} from "../../../../../redux/actions/texasMarriages";
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
    getTexasMarriagesDefaultValues
} from "../../../../../utils";
import TexasMarriagesTable from "../../../Table";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import TexasMarriagesSearchForm from "../components/SearchForm";
import TexasMarriagesRefineSearch from '../components/RefineSearch';
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
        ...mergeDeep(getTexasMarriagesDefaultValues(), _values),
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
        let marriageObj = null;
        if (_values?.m?.li?.i) {
            marriageObj = await getLocationGUID(_values.m?.li?.i);
        }
        setFormData(setValues, _values, marriageObj);
    } else {
        history.push("/search/texas-marriages");
    }
};
const genarateUrl = (formValues, history, page = 1) => {
    const _texasValues = { ...formValues };

    if (_texasValues.Marriage) {
        delete _texasValues.Marriage;
    }

    if (!_texasValues.fm.t) {
        delete _texasValues.fm;
    }
    if (!_texasValues.ln.t) {
        delete _texasValues.ln;
    }
    if (!_texasValues.matchExact) {
        delete _texasValues.matchExact;
    }
    history.push(`?${encodeDataToURL({ ...formDataTrim(_texasValues), pn: page })}`);
};

const SearchPageList = () => {
    const [isPageLoad, setisPageLoad] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [values, setValues] = useState(null);
    const [tableSize, setTableSize] = useState(null);
    const [valuesNew, setValuesNew] = useState(null);
    const [tableColTotal, setTableColTotal] = useState(0);
    const [tableColWidth, setTableColWidth] = useState([]);
    const location = useLocation();
    const newRequest = useRef(true);

    const history = useHistory();
    const { totalRecords, maskingFields } = useSelector(
        (state) => {
            return state.texasMarriages;
        }
    );
    const { contentCatalog } = useSelector((state) => {
        return state.sidebar;
      });
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const getTexasMarriagesList = useCallback(
        (formValues = values) => {
            if (formValues !== null) {
                const _values = getValuesForm(formValues);
                dispatch(submitTexasMarriagesForm(_values, newRequest.current));
            }
            newRequest.current = false;
        },
        [dispatch, values, newRequest]
    );

    useEffect(() => {
        getData(location.search, history, setValues);
    }, [setValues, location.search, history]);
    useEffect(() => {
        getTexasMarriagesList();
        return () => {
            let pathName = history.location.pathname;
            if (pathName !== "/search/texas-marriages/result" && pathName.split("/")?.[1] !== "records") {
                localStorage.removeItem('switch_status');
                dispatch(updateContentCatalog())
                dispatch(clearTexasMarriagesFormQuery())
            }
          }
    }, [dispatch,getTexasMarriagesList]);
    const handleSubmitTexasMarriages = (formValues) => {
        newRequest.current = true;
        setShowModal(false);
        genarateUrl(formValues, history);
    };
    const getTexasMarriagesListPage = (page) => {
        let data = { ...values, pn: page };
        genarateUrl(data, history, page);
        setisPageLoad(false);
    };
    const changeLimit = (pageLimit) => {
        let data = { ...values, pn: 1, ps: pageLimit };
        genarateUrl(data, history);
        setisPageLoad(false);
    };
    const { texasMarriageList, loading, DeathsPageLoading, error } = useSelector(
        (state) => state.texasMarriages
    );

    const TexasMarriagespageRecords = useMemo(() => {
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
        let formValue = mergeDeep(getTexasMarriagesDefaultValues(), values);
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
                        <TexasMarriagesLoader />
                    </div>
                </div>
            );
        } else {
            return texasMarriageList.length === 0 ? (
                <Norecords
                    searchResult={texasMarriageList}
                    isLoading={false}
                    firstName={getFirstName(values)}
                />
            ) : (
                <TexasMarriagesTable
                    tableSize={getTableSize}
                    handleTableColWidth={handleTableColWidth}
                    handleTableColTotal={handleTableColTotal}
                    data={texasMarriageList}
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
            <div className="page-wrap ww-results-wrap" id="texas-form">
                {DeathsPageLoading ? (
                    <div className="fixed w-full h-full z-1000 top-0 left-0 bg-white bg-opacity-60">
                        <div className="absolute top-50 z-50 top-2/4 left-2/4">
                            <TexasMarriagesLoader />
                        </div>
                    </div>
                ) : (
                    <div className="container mx-auto">
                        <div className="head w-full mb-4 text-center">
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
                                {TexasMarriagespageRecords !== 0 && (
                                    <p>
                                        <Typography
                                            fontFamily="primaryFont"
                                            size={14}
                                            text="secondary"
                                            weight="light"
                                        >
                                            {PaginationResult(
                                                t,
                                                TexasMarriagespageRecords,
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
                                        getList={getTexasMarriagesListPage}
                                        totalRecords={totalRecords}
                                        limitPerPage={parseInt(values?.ps || 20)}
                                        currentPage={parseInt(values?.pn || 0)}
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
                                    <TexasMarriagesRefineSearch
                                        width={""}
                                        handleSubmitTexasMarriages={handleSubmitTexasMarriages}
                                        texasMarriagesDefaultValues={values}
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
                        <TexasMarriagesSearchForm
                            inputWidth={""}
                            width={"sm:w-1/2"}
                            handleSubmitTexasMarriages={handleSubmitTexasMarriages}
                            defaultValues={valuesNew}
                            TMClear={false}
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
