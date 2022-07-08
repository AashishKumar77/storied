import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../../../components/Loader";
import Typography from "../../../../../components/Typography";
import Button from "../../../../../components/Button";
import { useHistory, useLocation } from "react-router-dom";
import TWPaginationComponent from "../../../../../components/Pagination/TWPaginationComponent";
import TailwindModal from "../../../../../components/TailwindModal";
import {
  getUSFederalCensusDropdownList,
  submitUSFederalCensusForm,
  clearUsFormQuery
} from "../../../../../redux/actions/USFederalCensus";
import { getLocationGUID } from "../../../../../redux/actions/ww1";
import { ssdi, updateContentCatalog } from "../../../../../redux/actions/sidebar";
import USFederalCensusSearchForm from "../components/SearchForm";
import {
  getButtonTitle,
  getFirstName,
  decodeDataToURL,
  encodeDataToURL,
  getPageSize,
  formDataTrim,
  getUSFederalCensusDefaultValue,
  mergeDeep,
  pageRecordsCountfn,
} from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import ClassNames from "classnames";
import USFederalTable from "../../../Table";
import USFederalCensusRefineSearch from "../components/RefineSearch";
import {
  updateBirthPlace,
  updateRSPlace,
  updateRSPPlace,
} from "../../../utils/common";
import { ListingPageheaderContent, PaginationResult } from "../../../../../utils/search";

const getValuesCensusForm = (formValues) => {
  const _values = { ...formValues };
  let birthObj = updateBirthPlace(_values),
    rsObj = updateRSPlace(_values),
    rspObj = updateRSPPlace(_values);
  return {
    ..._values,
    ...birthObj,
    ...rsObj,
    ...rspObj,
    pn: _values?.pn,
    ps: _values?.ps,
  };
};
const getData = async (search, history, setValues) => {
  if (search) {
    const _values = decodeDataToURL(search);
    let obj = null;
    let obj2 = null;
    let obj3 = null;
    if (_values?.b?.li?.i) {
      obj = await getLocationGUID(_values.b?.li?.i);
    }
    if (_values?.r?.li?.i) {
      obj2 = await getLocationGUID(_values.r?.li?.i);
    }
    if (_values?.pr?.li?.i) {
      obj3 = await getLocationGUID(_values.pr?.li?.i);
    }
    setValues({
      ...mergeDeep(getUSFederalCensusDefaultValue(), _values),
      ps: getPageSize(_values.ps),
      BirthPlace: {
        id: _values?.b?.li?.i,
        name: _values?.b?.l?.l,
        ...(obj ? { levelData: obj } : {}),
      },
      RSPlace: {
        id: _values?.r?.li?.i,
        name: _values.r?.l?.l,
        ...(obj2 ? { levelData: obj2 } : {}),
      },
      RSPPlace: {
        id: _values?.pr?.li?.i,
        name: _values.pr?.l?.l,
        ...(obj3 ? { levelData: obj3 } : {}),
      },
    });
  } else {
    history.push("/search/1940-united-states-federal-census");
  }
};
const genarateUrl = (formValues, history, page = 1) => {
  const _values = { ...formValues };
  if (_values.BirthPlace) {
    delete _values.BirthPlace;
  }
  if (_values.RSPlace) {
    delete _values.RSPlace;
  }
  if (_values.RSPPlace) {
    delete _values.RSPPlace;
  }
  if (!_values.matchExact) {
    delete _values.matchExact;
  }
  history.push(`?${encodeDataToURL({ ...formDataTrim(_values), pn: page })}`);
};
const SearchPageList = () => {
  const [censusTableSize, setCensusTableSize] = useState(null);
  const [isPageLoad, setisPageLoad] = useState(true);
  const [tableColWidth, setTableColWidth] = useState([]);
  const [tableColTotal, setTableColTotal] = useState(0);
  const history = useHistory();
  const location = useLocation();
  const [values, setValues] = useState(null);
  const [valuesNew, setValuesNew] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const newRequest = useRef(true);
  const { totalRecords, maskingFields } = useSelector((state) => {
    return state.USFederalCensus;
  });
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const getCensusList = useCallback(
    (formValues = values) => {
      if (formValues !== null) {
        const _values = getValuesCensusForm(formValues);
        dispatch(submitUSFederalCensusForm(_values, newRequest.current));
      }
      newRequest.current = false;
    },
    [dispatch, values, newRequest]
  );
  useEffect(() => {
    dispatch(getUSFederalCensusDropdownList()); //Dropdowns
  }, [dispatch]);
  useEffect(() => {
    getData(location.search, history, setValues);
  }, [setValues, location.search, history]);
  useEffect(() => {
    getCensusList();
    return () => {
      let pathName = history.location.pathname;
      if (pathName !== "/search/1940-united-states-federal-census/result" && pathName.split("/")?.[1] !== "records") {
        localStorage.removeItem('switch_status');
        dispatch(updateContentCatalog())
        dispatch(clearUsFormQuery())
      }
    }
  }, [dispatch,getCensusList]);
  const handleSubmitUSFederalCensus = (formValues) => {
    newRequest.current = true;
    setShowModal(false);
    genarateUrl(formValues, history);
  };
  const getCensusListPage = (page) => {
    let data = { ...values, pn: page };
    genarateUrl(data, history, page);
    setisPageLoad(false);
  };
  const changeLimit = (pageLimit) => {
    let data = { ...values, pn: 1, ps: pageLimit };
    genarateUrl(data, history);
    setisPageLoad(false);
  };
  const { USFederalCensusList, loading, pageLoading, error } = useSelector(
    (state) => state.USFederalCensus
  );
  useEffect(() => {
    dispatch(ssdi({}));
  }, [dispatch]);
  const UsFederalPageRecords = useMemo(() => {
    return pageRecordsCountfn(
      loading,
      error,
      totalRecords,
      values?.ps,
      values?.pn
    );
  }, [loading, error, totalRecords, values]);
  const handleCensusShowModal = (bool) => {
    let formValue = mergeDeep(getUSFederalCensusDefaultValue(), values);
    bool && setValuesNew(formValue);
    setShowModal(bool);
  };
  const buttonTitle = getButtonTitle(values);
  const getTableSize = (width) => {
    setCensusTableSize(width);
  };
  const handleCensusShowModalNew = (bool) => {
    handleCensusShowModal(bool);
  };
  const handleTableColTotal = (width) => {
    setTableColTotal(width);
  };
  const handleTableColWidth = (width) => {
    setTableColWidth(width);
  };

  const getCensusHtmlData = () => {
    if (!loading) {
      return USFederalCensusList.length === 0 ? (
        <Norecords
          searchResult={USFederalCensusList}
          isLoading={false}
          firstName={getFirstName(values)}
        />
      ) : (
        <USFederalTable
          data={USFederalCensusList}
          maskingFields={maskingFields}
          error={error}
          loading={loading}
          tableSize={getTableSize}
          isPageLoad={isPageLoad}
          tableColWidth={tableColWidth}
          handleTableColWidth={handleTableColWidth}
          tableColTotal={tableColTotal}
          handleTableColTotal={handleTableColTotal}
        />
      );
    } else {
      return (
        <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
          <div className="absolute top-50 z-50 top-2/4 left-2/4">
            <Loader />
          </div>
        </div>
      );
    }
  };
  return (
    <>
      <div className="page-wrap ww-results-wrap">
        {!pageLoading ? (
          <div className="container mx-auto">
            <div className="head w-full text-center mb-4">
              {ListingPageheaderContent(contentCatalog?.collectionTitle)}
              <div className="edit-new-link-wrap text-center mb-5 sml:hidden">
                <div className="links w-full flex justify-center">
                  <Button
                    handleClick={(e) => {
                      e.preventDefault();
                      handleCensusShowModal(true);
                    }}
                    title={tr(t, "search.ww1.list.esearch")}
                    type="default"
                  />
                  <Button
                    handleClick={(e) => {
                      e.preventDefault();
                      handleCensusShowModalNew(true);
                    }}
                    title={tr(t, "search.ww1.list.nsearch")}
                    type="default"
                  />
                </div>
              </div>
              <div>
                {UsFederalPageRecords !== 0 && (
                  <p>
                    <Typography
                      fontFamily="primaryFont"
                      size={14}
                      text="secondary"
                      weight="light"
                    >
                      {PaginationResult(
                        t,
                        UsFederalPageRecords,
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
                    {getCensusHtmlData()}
                  </div>
                </div>

                <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                  <TWPaginationComponent
                    limitPerPage={parseInt(values?.ps || 20)}
                    changeLimit={changeLimit}
                    tableSize={censusTableSize}
                    getList={getCensusListPage}
                    currentPage={parseInt(values?.pn || 0)}
                    totalRecords={totalRecords}
                  />
                </div>
              </div>
              <div
                className={ClassNames(
                  "census mb-8 sidebar-search hidden  flex-col",
                  {
                    "sml:flex": !loading && !pageLoading,
                  }
                )}
              >
                <div className="bg-white sm:rounded-lg shadow p-3 md:py-5 md:px-6">
                  <div className="head">
                    <h2 className="mb-3">
                      <Typography
                        text="secondary"
                        weight="medium"
                        fontFamily="primaryFont"
                      >
                        {tr(t, "search.ww1.rsearch")}
                      </Typography>
                    </h2>
                  </div>
                  <USFederalCensusRefineSearch
                    width={""}
                    handleSubmitUSFederalCensus={handleSubmitUSFederalCensus}
                    USDefaultValues={values}
                    handleShowModal={handleCensusShowModal}
                    buttonTitle={tr(t, "search.ww1.form.update")}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
            <div className="absolute top-50 z-50 top-2/4 left-2/4">
              <Loader />
            </div>
          </div>
        )}
        {/*Modal Tailwind Form*/}
        <TailwindModal
          title={contentCatalog?.collectionTitle}
          showClose={true}
          content={
            <USFederalCensusSearchForm
              inputWidth={""}
              width={"sm:w-1/2"}
              handleSubmitUSFederalCensus={handleSubmitUSFederalCensus}
              defaultValues={valuesNew}
              clear={false}
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
