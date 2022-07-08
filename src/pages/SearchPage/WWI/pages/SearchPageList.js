import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./../../../../components/Loader";
import Typography from "./../../../../components/Typography";
import Button from "./../../../../components/Button";
import { useHistory, useLocation } from "react-router-dom";
import TWPaginationComponent from "./../../../../components/Pagination/TWPaginationComponent";
import TailwindModal from "./../../../../components/TailwindModal";
import {
  submitWW1Form,
  getWWIList,
  getLocationGUID,
  clearWwiFormQuery
} from "./../../../../redux/actions/ww1";
import { ssdi, updateContentCatalog } from "./../../../../redux/actions/sidebar";
import WWISearchForm from "../components/SearchForm";
import WWIRefineSearch from "../components/RefineSearch";
import {
  getButtonTitle,
  getWWIDefaultValue,
  getFirstName,
  decodeDataToURL,
  encodeDataToURL,
  getPageSize,
  mergeDeep,
  formDataTrim,
  numToLocaleString,
  pageRecordsCountfn
} from "../../../../utils";
import { tr } from "../../../../components/utils";
import { useTranslation } from "react-i18next";
import Norecords from "../../NoRecord";
import "../../index.css";
import ClassNames from "classnames";
import Table from "../../Table";
const defaultValues = getWWIDefaultValue();
const getWwiPaginationResult = (
  t,
  pageRecords,
  limitPerPage,
  current,
  totalRecords
) =>
  pageRecords ? (
    <>
      {tr(t, "search.ww1.list.results")}{" "}
      {`${numToLocaleString(
        limitPerPage * (current - 1) + 1
      )}-${numToLocaleString(pageRecords)}`}{" "}
      {tr(t, "search.ww1.list.rpagination")} {numToLocaleString(totalRecords)}{" "}
    </>
  ) : (
    tr(t, "search.nresult")
  );
const getValuesForm = (formValues) => {
  const _values = { ...formValues };
  let li = {};
  if (_values.li?.i) {
    delete _values.l;
    const levelData = _values.LocationField.levelData;
    li = {
      li: {
        i: levelData?.residenceId[levelData.residenceLevel[_values.li.s]],
        s: _values.li.s,
      },
    };
  } else if (_values.l?.l) {
    delete _values.li;
  } else {
    delete _values.li;
    delete _values.l;
  }
  if (_values.LocationField) {
    delete _values.LocationField;
  }
  return { ..._values, ...li, pn: _values?.pn, ps: _values?.ps };
};
const getData = async (search, history, setValues) => {
  if (search) {
    const _values = decodeDataToURL(search);
    let data = null;
    if (_values?.li?.i) {
      data = await getLocationGUID(_values.li.i);
    }
    setValues({
      ...mergeDeep(defaultValues, _values),
      ps: getPageSize(_values.ps),
      LocationField: {
        id: _values?.li?.i,
        name: _values?.l?.l,
        ...(data ? { levelData: data } : {}),
      },
    });
  } else {
    history.push("/search/world-war-i-casualties");
  }
};
const genarateUrl = (formValues, history, page = 1) => {
  const _values = { ...formValues };
  if (_values.LocationField) {
    delete _values.LocationField;
  }
  if (_values.li.i) {
    delete _values.l.s
  }
  if (!_values.matchExact) {
    delete _values.matchExact
  }
  if (_values?.fm?.t?.givenName?.givenName) {
    _values["fm"]["t"] = _values?.fm?.t?.givenName?.givenName
  }
  if (_values?.fm?.t?.name) {
    _values["fm"]["t"] = _values?.fm?.t?.name
  }
  history.push(`?${encodeDataToURL({ ...formDataTrim(_values), pn: page })}`);
};

const SearchPageList = () => {
  const location = useLocation();
  const newRequest = useRef(true);
  const [values, setValues] = useState(null);
  const [valuesNew, setValuesNew] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tableSize, setTableSize] = useState(null);
  const [isPageLoad, setisPageLoad] = useState(true);
  const [tableColWidth, setTableColWidth] = useState([]);
  const [tableColTotal, setTableColTotal] = useState(0);
  const history = useHistory();
  const { totalRecords, maskingFields } = useSelector((state) => {
    return state.ww1;
  });
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const getWW1List = useCallback(
    (formValues = values) => {
      if (formValues !== null) {
        const _values = getValuesForm(formValues);
        dispatch(submitWW1Form(_values, newRequest.current));
      }
      newRequest.current = false;
    },
    [dispatch, values, newRequest]
  );
  useEffect(() => {
    dispatch(getWWIList()); //Dropdowns
    return () => {
      let pathName = history.location.pathname;
      if (pathName !== "/search/world-war-i-casualties/result" && pathName.split("/")?.[1] !== "records") {
        localStorage.removeItem('switch_status');
        dispatch(updateContentCatalog())
        dispatch(clearWwiFormQuery())
      }
    }
  }, [dispatch, getWWIList]);

  useEffect(() => {
    getData(location.search, history, setValues);
  }, [setValues, location.search, history]);
  useEffect(() => {
    getWW1List();
  }, [getWW1List]);
  const handleSubmitWWW1 = (formValues) => {
    newRequest.current = true;
    setShowModal(false);
    genarateUrl(formValues, history);
  };
  const getWW1ListPage = (page) => {
    let data = { ...values, pn: page };
    genarateUrl(data, history, page);
    setisPageLoad(false);
  };
  const changeLimit = (pageLimit) => {
    let data = { ...values, pn: 1, ps: pageLimit };
    genarateUrl(data, history);
    setisPageLoad(false);
  };
  useEffect(() => {
    dispatch(ssdi({}));
  }, [dispatch]);
  const { ww1List, loading, pageLoading, error } = useSelector(
    (state) => state.ww1
  );
  const pageRecords = useMemo(() => {
    return pageRecordsCountfn(
      loading,
      error,
      totalRecords,
      values?.ps,
      values?.pn
    );
  }, [loading, error, totalRecords, values]);
  const buttonTitle = getButtonTitle(values);
  const headerContent = (title) => (
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
  const handleShowModal = (bool, _values = values) => {
    let firstName = {}
    firstName.t = {
      id: "",
      name: values?.fm?.t || ""
    }
    firstName.s = values?.fm?.s || defaultValues?.fm?.s
    bool && setValuesNew({ ..._values, fm: firstName });
    setShowModal(bool);
  };
  const handleShowModalNew = (bool) => {
    handleShowModal(bool, defaultValues);
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
  const getHtmlData = () => {
    if (loading) {
      return (
        <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
          <div className="absolute top-50 z-50 top-2/4 left-2/4">
            <Loader />
          </div>
        </div>
      );
    } else {
      return ww1List.length === 0 ? (
        <Norecords searchResult={ww1List} isLoading={false} firstName={getFirstName(values)} />
      ) : (
        <Table
          data={ww1List}
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
    }
  };
  return (
    <>
      <div className="page-wrap ww-results-wrap">
        {pageLoading ? (
          <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
            <div className="absolute top-50 z-50 top-2/4 left-2/4">
              <Loader />
            </div>
          </div>
        ) : (
          <div className="container mx-auto">
            <div className="head w-full text-center mb-4">
              {headerContent(contentCatalog?.collectionTitle)}
              <div className="edit-new-link-wrap text-center mb-5 sml:hidden">
                <div className="links w-full flex justify-center">
                  <Button
                    handleClick={(e) => {
                      e.preventDefault();
                      handleShowModal(true);
                    }}
                    title={tr(t, "search.ww1.list.esearch")}
                    type="default"
                  />
                  <Button
                    handleClick={(e) => {
                      e.preventDefault();
                      handleShowModalNew(true);
                    }}
                    title={tr(t, "search.ww1.list.nsearch")}
                    type="default"
                  />
                </div>
              </div>
              <div>
                {pageRecords !== 0 && (
                  <p>
                    <Typography
                      fontFamily="primaryFont"
                      size={14}
                      text="secondary"
                      weight="light"
                    >
                      {getWwiPaginationResult(
                        t,
                        pageRecords,
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
                    {getHtmlData()}
                  </div>
                </div>
                <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                  <TWPaginationComponent
                    getList={getWW1ListPage}
                    currentPage={parseInt(values?.pn || 0)}
                    totalRecords={totalRecords}
                    limitPerPage={parseInt(values?.ps || 20)}
                    changeLimit={changeLimit}
                    tableSize={tableSize}
                  />
                </div>
              </div>
              <div
                className={ClassNames("mb-8 sidebar-search hidden  flex-col", {
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
                        {tr(t, "search.ww1.rsearch")}
                      </Typography>
                    </h2>
                  </div>
                  <WWIRefineSearch
                    width={""}
                    handleSubmitWWW1={handleSubmitWWW1}
                    defaultValues={values}
                    handleShowModal={handleShowModal}
                    buttonTitle={tr(t, "search.ww1.form.update")}
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
            <WWISearchForm
              inputWidth={""}
              width={"sm:w-1/2"}
              handleSubmitWWW1={handleSubmitWWW1}
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
