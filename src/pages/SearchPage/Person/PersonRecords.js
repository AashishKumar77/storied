import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../index.css";
import Loader from "../../../components/Loader";
import Typography from "../../../components/Typography";
import LazyLoadImage from "../../../components/LazyLoadImg";
import {
  decodeDataToURL,
  encodeDataToURL,
  formDataTrim,
  getPageSize,
  universalInitialValues,
  numToLocaleString,
  removeAtFromGuid,
  getTitleByPartitionKey,
} from "../../../utils";
import {
  submitPersonSearchForm,
  clearPersonFormQuery,
} from "../../../redux/actions/personRecord";
import TWPaginationComponent from "../../../components/Pagination/TWPaginationComponent";
import { tr, getQueryParam } from "../../../components/utils";
import Norecords from "../NoRecord";
import UseWindowDimensions from "../WindowDimensions";
import PersonDetail from "../PersonDetail";
import SidebarComponent from "../../../components/Sidebar";
import PaymentsModal from "../../Payment/PaymentsModal";
import { setIsPrivileged, getIsPrivileged } from "../../../services";
import { getTrees, getViewRecords } from "../../../redux/actions/sidebar";

const getResultTitle = (searchValue, t) => {
  let title = tr(t, "search.ww1.list.alrslt");
  if (
    searchValue.current &&
    (searchValue.current.fm?.t || searchValue.current.ln?.t)
  ) {
    title = `${tr(t, "search.ww1.list.alrsltfr")} ${
      (searchValue.current && searchValue.current.fm?.t) || ""
    } ${(searchValue.current && searchValue.current.ln?.t) || ""}`;
  }
  return title;
};
const getPageRecords = (limitPerPage, current, searchResult) => {
  let pageRecords = limitPerPage * current,
    totalRecords = (searchResult && searchResult.total) || 0;
  pageRecords = totalRecords > pageRecords ? pageRecords : totalRecords;
  return pageRecords;
};
const getCardStyle = (index) =>
  `${
    index % 2 === 0 ? "bg-gray-100" : ""
  } border-t border-gray-200 card sm:bg-white sm:rounded-lg px-5 pt-4 pb-5 sm:shadow table-hover`;
const getIframe = (history, data, index) => {
  let res = null;
  if (data?.image_id || data?.imageID) {
    res = (
      <div
        className="thumb relative w-14 h-14 cursor-pointer"
        onClick={() =>
          history.push(`/records/${data.recordId}/${data.partitionKey}`)
        }
      >
        <LazyLoadImage
          index={index}
          className="rounded-lg border border-gray-300 w-14 h-14 object-cover relative z-50 cursor-pointer"
          src={`https://imgapi.storied.com/StoriedThumbnail/${removeAtFromGuid(
            data.partitionKey
          )}/${data?.image_id || data?.imageID}.jpg`}
          alt="view records"
        />
      </div>
    );
  }
  return res;
};
const getHeaderRecordNumber = (
  t,
  pageRecords,
  current,
  searchResult,
  limitPerPage
) => {
  let total = (searchResult && searchResult.total) || 0,
    res = (
      <p className="whitespace-nowrap text-sm pl-2 hidden">
        {tr(t, "search.ww1.list.noresult")}
      </p>
    );
  if (total) {
    res = (
      <p className="whitespace-nowrap text-sm pl-2 hidden">
        {tr(t, "search.ww1.list.results")}{" "}
        {numToLocaleString(limitPerPage * (current - 1) + 1)}–
        {numToLocaleString(pageRecords)} of {`${numToLocaleString(total)}`}
      </p>
    );
  }
  return res;
};
const assignFormValue = (formValue, lsValue) => {
  if (!formValue.ls) formValue.ls = [];
  if (formValue.ls?.length === 0) {
    formValue.ls.push(lsValue);
  }
  if (!formValue.rs) formValue.rs = [];
  if (!formValue.kw) formValue.kw = "";
  if (!formValue.g) formValue.g = "";
  if (!formValue.cn) formValue.cn = "";
};
const PersonRecords = () => {
  const tableRef = useRef(null),
    itemsRef = useRef([]),
    { width } = UseWindowDimensions(),
    { t } = useTranslation();
  const dispatch = useDispatch(),
    { personId } = useParams(),
    history = useHistory();
  const searchValue = useRef(decodeDataToURL(getQueryParam())),
    [limitPerPage, setLimitPerPage] = useState(
      getPageSize(searchValue.current?.ps || 20)
    ),
    [current, setCurrent] = useState(searchValue.current?.pn || 1),
    [tableSize, setTableSize] = useState(null),
    [showPaymentModal, setPaymentModal] = useState(false),
    changeLimit = (pageLimit) => {
      setLimitPerPage(pageLimit);
      getResult(1, searchValue.current, pageLimit);
    };
  const [showSideBar, setShowSideBar] = useState(false),
    [itemIndex, setItemIndex] = useState(null),
    [prevNext, setPrevNext] = useState({
      prev: false,
      next: false,
    });
  const fetchData = useCallback(
    (formval = searchValue.current) => {
      if (formval) {
        dispatch(submitPersonSearchForm(personId));
      } else {
        history.push(`/search/person-records${personId}`);
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
  const { personRecords: searchResult, isLoading } = useSelector(
      (state) => state.personRecord
    ),
    { userAccount } = useSelector((state) => state.user),
    { isLoading: ssidIsLoading, ssid: ssdiData } = useSelector(
      (state) => state.sidebar
    ),
    { isPaySuccess } = useSelector((state) => state.payment);
  useEffect(() => {
    !isPaySuccess && setIsPrivileged(true);
  }, [isPaySuccess]);
  useEffect(() => {
    fetchData();
    return () => {
      let pathName = history.location.pathname;
      if (
        pathName !== "/search/person-records" &&
        pathName.split("/")?.[1] !== "records"
      ) {
        dispatch(clearPersonFormQuery());
      }
    };
  }, [dispatch, fetchData]);
  useEffect(() => {
    setTableSize(tableRef.current?.clientWidth);
  }, [setTableSize, width]);
  useEffect(() => {
    if (userAccount) {
      if (!ssdiData?.recordId) {
        removeStorageValue();
      } else {
        dispatch(getTrees(userAccount.id));
        setItemIndex(parseInt(localStorage.getItem("itemIndex")));
        setPrevNext(JSON.parse(localStorage.getItem("prevNext")));
        setShowSideBar(JSON.parse(localStorage.getItem("showSideBar")));
      }
    }
  }, [dispatch, userAccount]);
  useEffect(() => {
    return () => {
      let pathName = history.location.pathname;
      if (pathName.split("/")?.[1] !== "records") {
        removeStorageValue();
      }
    };
  }, [history]);
  let pageRecords = getPageRecords(limitPerPage, current, searchResult);
  const { initialValues: defaultValues } = universalInitialValues(),
    initialValues = { ...defaultValues, ...searchValue.current },
    lsValue = {
      le: "",
      l: { l: "", s: "1" },
      y: { y: "", s: "4" },
      li: { i: "", s: "4", name: "" },
    };
  assignFormValue(initialValues, lsValue);
  const getViewRecord = (recordId, partitionKey) => {
      let bool = true;
      dispatch(getViewRecords({ recordId, partitionKey }, bool));
    },
    removeStorageValue = () => {
      localStorage.removeItem("showSideBar");
      localStorage.removeItem("itemIndex");
      localStorage.removeItem("prevNext");
    },
    handleScrollPrev = () => {
      itemsRef?.current?.[
        searchResult?.documents?.[itemIndex].recordId
      ]?.scrollIntoView({
        block: "end",
        behaviour: "smooth",
      });
    },
    handleScrollNext = () => {
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
        handleRowClick(item);
      }
    },
    handleRowClick = (item) => {
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
        localStorage.setItem("showSideBar", true);
        localStorage.setItem("itemIndex", index);
        localStorage.setItem("prevNext", JSON.stringify(_prevNext));
        getViewRecord(item.recordId, item.partitionKey);
      } else {
        setItemIndex(null);
        removeStorageValue();
      }
      setShowSideBar((prev) => !prev);
    },
    handlePrevBtn = () => {
      let index = itemIndex - 1,
        _prevNext = {
          next: false,
          prev: index === 0,
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
    },
    handleNextBtn = () => {
      let index = itemIndex + 1,
        _prevNext = {
          next: index === searchResult?.documents?.length - 1,
          prev: false,
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
          <div className="pt-4 sm:pt-8 xl:px-0 md:flex sm:px-4 ">
            <div className="relative md:order-2 u-search-results-wrap md:pl-4 lg:pl-6">
              <div className="head px-4">
                <div className="head mb-5 flex flex-wrap  justify-center sm:justify-between items-center flex">
                  <h2 className="inline mb-0 break-words overflow-ellipsis overflow-hidden hidden">
                    <Typography size={24} text="secondary" weight="medium">
                      {getResultTitle(searchValue, t)}
                    </Typography>
                  </h2>
                  {getHeaderRecordNumber(
                    t,
                    pageRecords,
                    current,
                    searchResult,
                    limitPerPage
                  )}
                </div>
                <div className="text-center pb-4 sm:hidden">
                  <p className="text-sm">
                    {tr(t, "search.ww1.list.results")}{" "}
                    {limitPerPage * (current - 1) + 1}–{pageRecords} of{" "}
                    {`${(searchResult && searchResult.total) || 0}`}
                  </p>
                </div>
              </div>
              {isLoading && !searchResult && (
                <div className="fixed w-full h-full left-0 top-0 bg-white bg-opacity-60 z-1000">
                  <div className="absolute top-50 z-50 top-2/4 left-2/4">
                    <Loader />
                  </div>
                </div>
              )}
              <div
                ref={tableRef}
                className="w-full sm:border-0 border-b border-gray-200"
              >
                {searchResult?.documents?.length > 0 ? (
                  searchResult?.documents?.map((item, index) => {
                    return (
                      <div
                        key={index.toString()}
                        ref={(el) => (itemsRef.current[item.recordId] = el)}
                        onClick={() => onCardClick(item)}
                        className={`search-cards-wrap sm:mb-4 sm:hover:shadow-md relative ${
                          index === itemIndex ? "active" : ""
                        }`}
                      >
                        <div className={getCardStyle(index)}>
                          <div className="md:flex">
                            <div className="content-block flex-grow">
                              <div className="head mb-5">
                                <h3 className="mb-1">
                                  <Typography weight="medium" text="secondary">
                                    {item.selfFull_name_display_value?.value}
                                  </Typography>
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {getTitleByPartitionKey(item?.partitionKey)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Score :  <span className="text-sm text-gray-700">{item?.score}</span>
                                </p>
                              </div>
                              <PersonDetail
                                item={item}
                              />
                            </div>
                            <div className="hidden md:flex flex-col items-center item-block max-w-xs px-1 py-2">
                              <div className="mb-3 link-wrap">
                                <span className="whitespace-nowrap cursor-pointer hover:underline decoration">
                                  <Typography
                                    size={14}
                                    weight="medium"
                                    text="primary"
                                  >
                                    Quick View
                                  </Typography>
                                </span>
                              </div>
                              {getIframe(history, item, index)}
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
              <div className="px-3 sm:p-0 relative -top-4 pb-4 hidden">
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
          </div>
        </div>
      </div>
      {showSideBar && (
        <SidebarComponent
          isLoading={ssidIsLoading}
          profile={ssdiData}
          showSideBar={showSideBar}
          prevNext={prevNext}
          showSideBarAction={handleRowClick}
          handlePrev={handlePrevBtn}
          handleNext={handleNextBtn}
          comparedTo={true}
          type={"records"}
        />
      )}
      {showPaymentModal && (
        <PaymentsModal
          showPaymentModal={showPaymentModal}
          setPaymentModal={setPaymentModal}
        />
      )}
    </>
  );
};

export default PersonRecords;
