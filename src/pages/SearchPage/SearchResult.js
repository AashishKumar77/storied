import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../components/Loader";
import Typography from "./../../components/Typography";
import Button from "./../../components/Button";
import LazyLoadImage from "./../../components/LazyLoadImg";
import {
  decodeDataToURL,
  encodeDataToURL,
  formDataTrim,
  getPageSize,
  setDropdownObject,
  universalInitialValues,
  formVaildate,
  numToLocaleString,
  removeAtFromGuid,
  getTitleByPartitionKey,
} from "./../../utils";
import { useHistory } from "react-router-dom";
import {
  submitUniversalSearchForm,
  placeAuthority,
  clearUniversalFormQuery,
  getEventDropdown
} from "../../redux/actions/universalSearch";
import TWPaginationComponent from "../../components/Pagination/TWPaginationComponent";
import UniversalRefineSearch from "./UniversalRefineSearch";
import { tr, getQueryParam } from "../../components/utils";
import { useTranslation } from "react-i18next";
import UniversalSearchForm from "./UniversalSearchForm";
import TailwindModal from "./../../components/TailwindModal";
import Norecords from "./NoRecord";
import UseWindowDimensions from "./WindowDimensions";
import PersonDetail from "./PersonDetail";
import { getTrees, getViewRecords } from "./../../redux/actions/sidebar";
import SidebarComponent from "../../components/Sidebar";
import "./index.css";
import PaymentsModal from "./../Payment/PaymentsModal";
import { setIsPrivileged, getIsPrivileged } from "../../services";

const getResultTitle = (searchValue, t) => {
  let title = tr(t, "search.ww1.list.alrslt");
  if (
    searchValue.current &&
    (searchValue.current.fm?.t || searchValue.current.ln?.t)
  ) {
    title = `${tr(t, "search.ww1.list.alrsltfr")} ${(searchValue.current && searchValue.current.fm?.t) || ""
      } ${(searchValue.current && searchValue.current.ln?.t) || ""}`;
  }
  return title;
};
const getdropdowns = async (searchValue, t) => {
  let lifeEvents = searchValue.ls || [],
    arr = [];
  for (let lifeEvent of lifeEvents) {
    if (lifeEvent?.li?.i) {
      let obj = { 4: tr(t, "search.form.dropdown.broad") };
      let data = await placeAuthority(lifeEvent?.li?.i);
      setDropdownObject(data, obj, t, tr);
      let parent = data.parent;
      while (parent) {
        setDropdownObject(parent, obj, t, tr);
        parent = parent.parent;
      }
      arr.push(obj);
    } else if (lifeEvent?.l?.l) {
      arr.push("");
    }
  }
  return arr;
};
const handFormsubmit = (formik) => {
  if (formik.dirty && formik.isValid) {
    formik.handleSubmit();
  }
};
const getPageRecords = (limitPerPage, current, searchResult) => {
  let pageRecords = limitPerPage * current,
    totalRecords = (searchResult && searchResult.total) || 0;
  pageRecords = totalRecords > pageRecords ? pageRecords : totalRecords;
  return pageRecords;
};
const getCardClass = (index) =>
  `${index % 2 === 0 ? "bg-gray-100" : ""
  } border-t border-gray-200 card sm:bg-white sm:rounded-lg sm:shadow px-5 pt-4 pb-5 table-hover`;
const getIframe = (item, index, history) => {
  let html = null;
  if (item?.image_id || item?.imageID) {
    html = (
      <div
        onClick={() =>
          history.push(`/records/${item.recordId}/${item.partitionKey}`)
        }
        className="thumb relative w-14 h-14 cursor-pointer"
      >
        <LazyLoadImage
          index={index}
          className="rounded-lg border border-gray-300 w-14 h-14 object-cover relative z-50 cursor-pointer"
          src={`https://imgapi.storied.com/StoriedThumbnail/${removeAtFromGuid(
            item.partitionKey
          )}/${item?.image_id || item?.imageID}.jpg`}
          alt={"view records"}
        />
      </div>
    );
  }
  return html;
};
const getHeaderRecordNumber = (
  t,
  limitPerPage,
  current,
  pageRecords,
  searchResult
) => {
  let total = (searchResult && searchResult.total) || 0,
    html = (
      <p className="whitespace-nowrap pl-2 text-sm hidden sm:block">
        {tr(t, "search.ww1.list.noresult")}
      </p>
    );
  if (total) {
    html = (
      <p className="whitespace-nowrap pl-2 text-sm hidden sm:block">
        {tr(t, "search.ww1.list.results")}{" "}
        {numToLocaleString(limitPerPage * (current - 1) + 1)}–
        {numToLocaleString(pageRecords)} of {`${numToLocaleString(total)}`}
      </p>
    );
  }
  return html;
};
const getLifeEventSearch = (values) => {
  let ls = (values.ls || []).filter((y) => {
    return y.l?.l !== "" || y.li?.i !== "" || y.y?.y !== "";
  });
  let arr = [];
  for (let item of ls) {
    let obj = {};
    if (item.li?.i) {
      obj.li = item.li;
    } else {
      obj.l = item.l || "";
    }
    if (item.y?.y) {
      obj.y = item.y;
    }
    if (item?.y?.y || item?.li?.i || item?.l?.l) {
      obj.le = item.le;
      arr.push(obj);
    }
  }
  return arr;
};
const assignFormValue = (initialValues, lsValue) => {
  if (!initialValues.ls) initialValues.ls = [];
  if (initialValues.ls?.length === 0) {
    initialValues.ls.push(lsValue);
  }
  if (!initialValues.rs) initialValues.rs = [];
  if (!initialValues.kw) initialValues.kw = "";
  if (!initialValues.g) initialValues.g = "";
  if (!initialValues.cn) initialValues.cn = "";
};
const SearchResult = () => {
  const tableRef = useRef(null),
    itemsRef = useRef([]);
  const { width } = UseWindowDimensions();
  const { t } = useTranslation();
  const dispatch = useDispatch(),
    history = useHistory();
  const searchValue = useRef(decodeDataToURL(getQueryParam()));
  const [limitPerPage, setLimitPerPage] = useState(
    getPageSize(searchValue.current?.ps)
  );
  const [current, setCurrent] = useState(searchValue.current?.pn || 1);
  const [showModal, setShowModal] = useState(false);
  const [showModalNew, setShowModalNew] = useState(false);
  const [option, setOptionVal] = useState([]);
  const [tableSize, setTableSize] = useState(null);
  const [showPaymentModal, setPaymentModal] = useState(false);
  const changeLimit = (pageLimit) => {
    setLimitPerPage(pageLimit);
    getResult(1, searchValue.current, pageLimit);
  };
  const [showSideBar, setShowSideBar] = useState(false),
    [itemIndex, setItemIndex] = useState(null),
    [prevNext, setPrevNext] = useState({
      prev: false,
      next: false,
    });
  const headerText = "Edit Search";
  const fetchData = useCallback(
    (formval = searchValue.current) => {
      if (formval) {
        const universal_form_switch_status = localStorage.getItem(
          "universal_form_switch_status"
        );
        const urlQuery = encodeDataToURL({ ...formDataTrim(formval) });
        const isloggedin = universal_form_switch_status || "true";
        dispatch(
          submitUniversalSearchForm(
            { query: urlQuery },
            isloggedin
          )
        );
      } else {
        history.push("/search/universal_serach");
      }
    },
    [history, dispatch]
  );
  const getResult = (
    page,
    formValues = searchValue.current,
    pageLimit = limitPerPage
  ) => {
    formValues.pn = page;
    formValues.ps = pageLimit;
    fetchData(formValues);
    setCurrent(page);
    const urlQuery = encodeDataToURL({ ...formDataTrim(formValues) });
    history.push(`?${urlQuery}`);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const { universal_search: searchResult, isLoading } = useSelector(
    (state) => state.search
  );
  const { userAccount } = useSelector((state) => state.user);
  const { isLoading: ssidIsLoading, ssid: ssdiData } = useSelector(
    (state) => state.sidebar
  );

  const { isPaySuccess } = useSelector((state) => state.payment);

  const handleSubmit = (values, props) => {
    setCurrent(1);
    let ls = getLifeEventSearch(values);
    let rel = (values.rs || []).filter(
      (y) => (y?.f && y?.f !== "") || (y?.l && y?.l !== "")
    );
    let formValue = { ...values, pn: 1 };
    if (ls.length) {
      formValue.ls = ls;
    } else {
      delete formValue.ls;
    }
    if (rel.length) {
      formValue.rs = rel;
    } else {
      delete formValue.rs;
    }
    if (!formValue.matchExact) {
      delete formValue.matchExact;
    }
    if(formValue?.fm?.t?.givenName?.givenName){
      values["fm"]["t"] = values?.fm?.t?.givenName?.givenName
    }
    if(formValue?.fm?.t?.name){
      values["fm"]["t"] = values?.fm?.t?.name
    }
    searchValue.current = formValue;
    const urlQuery = encodeDataToURL({ ...formDataTrim(formValue) });
    history.push(`?${urlQuery}`);
    fetchData(formValue);
    setShowModal(false);
  };

  useEffect(() => {
    !isPaySuccess && setIsPrivileged(true);
  }, [isPaySuccess]);
  useEffect(() => {
    getdropdowns(searchValue.current, t).then((dataObj) => {
      setOptionVal(dataObj);
    });
  }, [searchValue?.current, t]);
  useEffect(() => {
    dispatch(getEventDropdown())
    fetchData();
    return () => {
      let pathName = history.location.pathname;
      if (pathName !== "/search/all-historical-records/result" && pathName.split("/")?.[1] !== "records") {
        localStorage.removeItem('universal_form_switch_status');
        dispatch(clearUniversalFormQuery())
      }
    }
  }, [dispatch, fetchData]);
  useEffect(() => {
    setTableSize(tableRef.current?.clientWidth);
  }, [width, setTableSize]);
  useEffect(() => {
    return () => {
      if (history.location.pathname.split("/")?.[1] !== "records") {
        removeStorageValue();
      }
    };
  }, [history]);
  useEffect(() => {
    if (userAccount) {
      if (!ssdiData?.recordId) {
        removeStorageValue();
      } else {
        dispatch(getTrees(userAccount.id));
        setShowSideBar(JSON.parse(localStorage.getItem("showSideBar")));
        setItemIndex(parseInt(localStorage.getItem("itemIndex")));
        setPrevNext(JSON.parse(localStorage.getItem("prevNext")));
      }
    }
  }, [userAccount, dispatch]);
  let pageRecords = getPageRecords(limitPerPage, current, searchResult);
  const { initialValues: defaultValues } = universalInitialValues();
  let firstName = {}
  firstName.t = {
    id : "",
    name : searchValue.current?.fm?.t || ""
  }
  firstName.s = searchValue.current?.fm?.s || defaultValues?.fm?.s
  const initialValues = { ...defaultValues, ...searchValue.current, fm: firstName };
  const lsValue = {
    le: "",
    l: { l: "", s: "1" },
    y: { y: "", s: "4" },
    li: { i: "", s: "4", name: "" },
  };
  assignFormValue(initialValues, lsValue);
  const getViewRecord = (recordId, partitionKey) => {
    let isUniverse = true;
    dispatch(getViewRecords({ recordId, partitionKey }, isUniverse));
  };
  const removeStorageValue = () => {
    localStorage.removeItem("itemIndex");
    localStorage.removeItem("prevNext");
    localStorage.removeItem("showSideBar");
  };
  const handleScrollPrev = () => {
    itemsRef?.current?.[
      searchResult?.documents?.[itemIndex].recordId
    ]?.scrollIntoView({
      block: "end",
      behaviour: "smooth",
    });
  };
  const handleScrollNext = () => {
    itemsRef?.current?.[
      searchResult?.documents?.[itemIndex].recordId
    ]?.scrollIntoView({
      block: "start",
      behaviour: "smooth",
    });
  };

  const onCardClick = (item) => {
    if (!getIsPrivileged()) {
      setPaymentModal(true);
    } else {
      onRowClick(item);
    }
  };

  const onRowClick = (item) => {
    if (!showSideBar) {
      let index = searchResult?.documents?.findIndex(
        (y) => y.recordId === item.recordId
      ),
        _prevNext = {
          prev: index === 0,
          next: index === searchResult?.documents?.length - 1,
        };
      setItemIndex(index);
      setPrevNext(_prevNext);
      localStorage.setItem("itemIndex", index);
      localStorage.setItem("prevNext", JSON.stringify(_prevNext));
      localStorage.setItem("showSideBar", true);
      getViewRecord(item.recordId, item.partitionKey);
    } else {
      setItemIndex(null);
      removeStorageValue();
    }
    setShowSideBar((prev) => !prev);
  };
  const handlePrev = () => {
    let index = itemIndex - 1,
      _prevNext = {
        prev: index === 0,
        next: false,
      };
    setItemIndex(index);
    setPrevNext(_prevNext);
    localStorage.setItem("itemIndex", index);
    localStorage.setItem("prevNext", JSON.stringify(_prevNext));
    getViewRecord(
      searchResult?.documents?.[index].recordId,
      searchResult?.documents?.[index].partitionKey
    );
    handleScrollPrev();
  };
  const handleNext = () => {
    let index = itemIndex + 1,
      _prevNext = {
        prev: false,
        next: index === searchResult?.documents?.length - 1,
      };
    setItemIndex(index);
    setPrevNext(_prevNext);
    localStorage.setItem("itemIndex", index);
    localStorage.setItem("prevNext", JSON.stringify(_prevNext));
    getViewRecord(
      searchResult?.documents?.[index].recordId,
      searchResult?.documents?.[index].partitionKey
    );
    handleScrollNext();
  };
  return (
    <>
      <div className="page-wrap universal-search-page">
        <div className="container mx-auto">
          <div className="pt-4 sm:pt-8 md:flex sm:px-4 xl:px-0">
            <div className="relative md:order-2 u-search-results-wrap md:pl-4 lg:pl-6">
              <div className="head px-4">
                <div className="head mb-5 flex flex-wrap  justify-center sm:justify-between items-center flex">
                  <h2 className="inline mb-0 break-words overflow-ellipsis overflow-hidden">
                    <Typography size={24} text="secondary" weight="medium">
                      {getResultTitle(searchValue, t)}
                    </Typography>
                  </h2>
                  {getHeaderRecordNumber(
                    t,
                    limitPerPage,
                    current,
                    pageRecords,
                    searchResult
                  )}
                </div>
                <div className="edit-new-link-wrap text-center mb-5 sm:hidden">
                  <div className="links w-full flex justify-center">
                    <Button
                      handleClick={(e) => {
                        e.preventDefault();
                        setShowModalNew(false);
                        setShowModal(true);
                      }}
                      title="Edit Search"
                      type="default"
                    />
                    <Button
                      handleClick={(e) => {
                        e.preventDefault();
                        setShowModalNew(universalInitialValues().initialValues);
                        setShowModal(true);
                      }}
                      title="New Search"
                      type="default"
                    />
                  </div>
                </div>
                <div className="text-center sm:hidden pb-4">
                  <p className="text-sm">
                    {tr(t, "search.ww1.list.results")}{" "}
                    {limitPerPage * (current - 1) + 1}–{pageRecords} of{" "}
                    {`${(searchResult && searchResult.total) || 0}`}
                  </p>
                </div>
              </div>
              {isLoading && !searchResult && (
                <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
                  <div className="absolute top-50 z-50 top-2/4 left-2/4">
                    <Loader />
                  </div>
                </div>
              )}
              <div
                ref={tableRef}
                className="w-full border-b border-gray-200 sm:border-0"
              >
                {searchResult?.documents?.length > 0 ? (
                  searchResult?.documents?.map((item, index) => {
                    return (
                      <div
                        key={index.toString()}
                        ref={(el) => (itemsRef.current[item.recordId] = el)}
                        className={`search-cards-wrap sm:mb-4 sm:hover:shadow-md relative ${index === itemIndex ? "active" : ""
                          }`}
                        onClick={() => onCardClick(item)}
                      >
                        <div className={getCardClass(index)}>
                          <div className="md:flex">
                            <div className="content-block flex-grow">
                              <div className="head mb-5">
                                <h3 className="mb-1">
                                  <Typography text="secondary" weight="medium">
                                    {item.selfFull_name_display_value.value}
                                  </Typography>
                                </h3>
                                <p className="text-gray-500 text-sm">
                                  {getTitleByPartitionKey(item?.partitionKey)}
                                </p>
                              </div>
                              <PersonDetail
                                item={item}
                              />
                            </div>
                            <div className="hidden md:flex flex-col items-center item-block max-w-xs py-2 px-1">
                              <div className="link-wrap mb-3">
                                <span className="whitespace-nowrap cursor-pointer decoration hover:underline">
                                  <Typography
                                    size={14}
                                    text="primary"
                                    weight="medium"
                                  >
                                    Quick View
                                  </Typography>
                                </span>
                              </div>
                              {getIframe(item, index, history)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <Norecords
                    isLoading={isLoading}
                    firstName={searchValue.current?.fm?.t}
                    searchResult={searchResult?.documents}
                  />
                )}
              </div>
              <div className="px-3 sm:p-0 relative -top-4 pb-4">
                <TWPaginationComponent
                  getList={getResult}
                  currentPage={parseInt(current || 0)}
                  totalRecords={searchResult?.total || 0}
                  limitPerPage={limitPerPage}
                  changeLimit={changeLimit}
                  tableSize={tableSize}
                />
              </div>
            </div>
            <UniversalRefineSearch
              searchValue={searchValue.current}
              option={option}
              setShowModal={setShowModal}
              setCurrent={setCurrent}
            />
          </div>
        </div>
        {/*tailwind modal*/}
        <TailwindModal
          title={headerText}
          showClose={true}
          content={
            <UniversalSearchForm
              handFormsubmit={handFormsubmit}
              handleSubmit={handleSubmit}
              initialValues={showModalNew ? showModalNew : initialValues}
              isEdit={true}
              setellOptions={option}
              showHeader={false}
              formVaildate={formVaildate}
              location={{
                le: "",
                l: { l: "", s: "1" },
                y: { y: "", s: "4" },
                li: { i: "", s: "4", name: "" },
              }}
              advancedOpen={true}
            />
          }
          showModal={showModal}
          setShowModal={setShowModal}
        />
      </div>
      {showSideBar && (
        <SidebarComponent
          isLoading={ssidIsLoading}
          profile={ssdiData}
          showSideBar={showSideBar}
          prevNext={prevNext}
          showSideBarAction={onRowClick}
          handlePrev={handlePrev}
          handleNext={handleNext}
          comparedTo={true}
          type={"records"}
        />
      )}
      {showPaymentModal &&
        <PaymentsModal
          showPaymentModal={showPaymentModal}
          setPaymentModal={setPaymentModal}
        />
      }
    </>
  );
};

export default SearchResult;
