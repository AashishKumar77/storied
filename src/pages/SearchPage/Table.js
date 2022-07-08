import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import UseWindowDimensions from "./WindowDimensions";
import Typography from "./../../components/Typography";
import { tr } from "../../components/utils";
import Loader from "../../components/Loader";
import SidebarComponent from "../../components/Sidebar";
import { getTrees, getViewRecords } from "./../../redux/actions/sidebar";
import { getValue, strFirstUpCase } from "../../utils";
import PaymentsModal from "./../Payment/PaymentsModal";
import { setIsPrivileged, getIsPrivileged } from "../../services";

const HEADERWIDTH = 64;
const getMaskClass = (maskingFields, field) => {
  return (maskingFields?.includes(field) && "filter blur-sm") || "";
};
const getRow = (content, classdata, index) => {
  return (
    <td key={index} className={`${classdata} sml:py-1.5 break-all`}>
      <Typography fontFamily="primaryFont" size={14} text="secondary">
        {content}
      </Typography>
    </td>
  );
};
const getMaskStr = (content, maskClass) => {
  let html = [],
    index = content?.indexOf?.("||");
  if (index === 0) {
    let arr = content.split(",") || [];
    arr.forEach((item, i) => {
      html.push(
        <span key={i} className={item.trim().indexOf("||") == 0 ? maskClass : ""}>
          {item.replaceAll("||", "")}
        </span>
      );
    });
  } else {
    html = <span className={maskClass}>{content}</span>;
  }
  return html;
};
const getRowWithMobile = (field, content, index, classdata, maskingFields) => {
  const maskClass = getMaskClass(maskingFields, strFirstUpCase(field)),
    maskContent = getMaskStr(content, maskClass);
  const contentData = (
    <>
      <span className="select-none text-gray-500 pr-2 w-32 th-show-mobile">{field}</span>
      {maskContent}
    </>
  );
  return getRow(contentData, classdata, index);
};
const getErrorLoadingCode = (error, loading, t) => {
  let html = null;
  if (error) {
    html = (
      <tr colSpan="5" className="text-center">
        <td colSpan="5" className="text-sm py-2 px-3 text-gray-700 py-2 px-3">
          {tr(t, "search.ww1.list.tryerr")}
        </td>
      </tr>
    );
  } else if (loading) {
    html = (
      <tr className="w-full">
        <td colSpan="5" className="text-center">
          <Loader />
        </td>
      </tr>
    );
  }
  return html;
};
const Table = ({ data, maskingFields, error, loading, tableSize, isPageLoad, tableColWidth, handleTableColWidth, tableColTotal, handleTableColTotal }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { isLoading, ssid: ssdiData } = useSelector((state) => state.sidebar),
    { userAccount } = useSelector((state) => state.user);
  const [showSideBar, setShowSideBar] = useState(false),
    [itemIndex, setItemIndex] = useState(null),
    [prevNext, setPrevNext] = useState({
      prev: false,
      next: false,
    });
  const [showPaymentModal, setPaymentModal] = useState(false);
  const tableRef = useRef(null),
    itemsRef = useRef([]),
    { width } = UseWindowDimensions(),
    { t } = useTranslation(),
    tableWidth = width >= 960 ? width - 344 : width - 48,
    columnWidth = 96;
  const { isPaySuccess } = useSelector((state) => state.payment);
  const getNoOfCols = () => {
    return Math.floor(tableWidth / columnWidth) - 1;
  };
  const headerColumn = () => {
    let column = data && data.length > 0 ? Object.keys(data[0]) : [];
    column.splice(0, 3);
    if (tableWidth > 624) {
      column.splice(getNoOfCols(), column.length);
    }
    column.splice(6, column.length);
    return column;
  };
  useEffect(() => {
    tableSize(tableRef.current?.clientWidth);
  }, [width, tableSize]);

  useEffect(()=>{
    !isPaySuccess && setIsPrivileged(true);
  }, [isPaySuccess]);
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
  }, [dispatch, userAccount]);
  useEffect(() => {
    return () => {
      if (history.location.pathname.split("/")?.[1] !== "records") {
        removeStorageValue();
      }
    };
  }, [history]);
  const pushToArray = (key, obj) => {
    let index = tableColWidth.findIndex((e) => e[key] === obj[key]);
    if (index === -1) {
      tableColWidth.push(obj);
    }
    setTimeout(() => {
      handleTableColWidth(tableColWidth);
    }, 1000);
  };
  const getTextWidth = (key, text) => {
    let strWidth,
      canvas = document.createElement("canvas"),
      context = canvas.getContext("2d");
    context.font = "400 14px Atlas Grotesk Web Regular,sans-serif";
    strWidth = context.measureText(text).width;
    isPageLoad && pushToArray(key, { [key]: Math.floor(strWidth) });
    return Math.floor(strWidth);
  };
  const findLargestStr = (key) => {
    let largestStr =
      data &&
      data.reduce(function (a, b) {
        return a[key]?.length > b[key]?.length ? a : b;
      });
    return largestStr && getTextWidth(key, largestStr[key]);
  };
  const totalAllLargestStr = () => {
    if (isPageLoad) {
      let largestStr =
          headerColumn().length > 0 &&
          headerColumn().map((key) => {
            return findLargestStr(key);
          }),
        result = largestStr.reduce(function (a, b) {
          return a + b;
        });
      setTimeout(() => {
        handleTableColTotal(result);
      }, 1000);
      return result;
    } else {
      return tableColTotal;
    }
  };
  const convertStrToPixel = (key) => {
    return findLargestStr(key);
  };
  const maxStrWidth = (maxWidth, colWidth, padding) => {
    let result = "";
    if (maxWidth >= colWidth) {
      result = maxWidth + padding + 2;
    } else if (maxWidth / 2 < 45) {
      result = colWidth;
    } else {
      result = colWidth + padding;
    }
    return result;
  };
  const getSavedColumnWidth = (key) => {
    let result = "";
    tableColWidth.forEach((element) => {
      if (element[key]) {
        result = getColumnWidth(element[key]);
      }
    });
    return result;
  };
  const getColumnWidth = (strPixel) => {
    let result = columnWidth;
    if (tableWidth > 624) {
      let numOfCol = headerColumn().length > 0 && headerColumn().length,
        strWidth = 72,
        padding = 24,
        totalColWidth = columnWidth * (numOfCol + 1),
        calTableWidth = tableWidth - totalColWidth,
        calColumnWidth = Math.round((calTableWidth / totalAllLargestStr()) * strPixel),
        calColWidthWithStr = calColumnWidth + strWidth,
        maxWidth = strPixel * 2;
      if (maxWidth <= calColumnWidth) {
        result = maxStrWidth(maxWidth, columnWidth, padding);
      } else if (maxWidth <= columnWidth) {
        result = calColumnWidth >= columnWidth ? calColumnWidth + strPixel : columnWidth + padding;
      } else if (calColWidthWithStr >= maxWidth) {
        result = maxWidth + padding;
      } else {
        result = calColumnWidth >= columnWidth ? calColumnWidth + strWidth : columnWidth + padding;
      }
      return result;
    }
    return result;
  };
  const goToRecord = (e, item) => {
    e.stopPropagation();
    history.push(`/records/${item.recordId}/${item.partitionKey}`);
  };
  const getViewRecord = (item) => {
    let { recordId, partitionKey } = item;
    dispatch(getViewRecords({ recordId, partitionKey }));
  };
  const removeStorageValue = () => {
    localStorage.removeItem("itemIndex");
    localStorage.removeItem("prevNext");
    localStorage.removeItem("showSideBar");
  };
  const onRowClick = (item) => {
    if (!getIsPrivileged()) {
      setPaymentModal(true);
    } else {
    if (!showSideBar) {
      let index = data.findIndex((y) => y.recordId === item.recordId),
        _prevNext = { prev: index === 0, next: index === data.length - 1 };
      setItemIndex(index);
      setPrevNext(_prevNext);
      localStorage.setItem("itemIndex", index);
      localStorage.setItem("prevNext", JSON.stringify(_prevNext));
      localStorage.setItem("showSideBar", true);
      getViewRecord(item);
    } else {
      setItemIndex(null);
      removeStorageValue();
    }
    setShowSideBar((prev) => !prev);
    }
  };
  const handleScrollPrev = () => {
    itemsRef?.current?.[data[itemIndex].recordId]?.scrollIntoView({
      block: "end",
      behaviour: "smooth",
      inline: "nearest",
    });
  };
  const handleScrollNext = () => {
    let elementPosition = itemsRef?.current?.[data[itemIndex].recordId]?.getBoundingClientRect().top,
      offsetPosition = elementPosition + window.scrollY - HEADERWIDTH;
    window.scroll({ top: offsetPosition, behavior: "smooth" });
  };
  const handlePrev = () => {
    let index = itemIndex - 1,
      _prevNext = { prev: index === 0, next: false };
    setItemIndex(index);
    setPrevNext(_prevNext);
    localStorage.setItem("itemIndex", index);
    localStorage.setItem("prevNext", JSON.stringify(_prevNext));
    getViewRecord(data[index]);
    handleScrollPrev();
  };
  const handleNext = () => {
    let index = itemIndex + 1,
      _prevNext = { prev: false, next: index === data.length - 1 };
    setItemIndex(index);
    setPrevNext(_prevNext);
    localStorage.setItem("itemIndex", index);
    localStorage.setItem("prevNext", JSON.stringify(_prevNext));
    getViewRecord(data[index]);
    handleScrollNext();
  };
  return (
    <>
      <table ref={tableRef} className="table-auto results-table">
        <thead>
          <tr className="border border-gray-200 border-b">
            {headerColumn().length > 0 &&
              headerColumn().map((item, index) => {
                return (
                  <th
                    key={index}
                    className={`py-1.5 hidden sm:table-cell`}
                    style={{
                      width: isPageLoad ? `${getColumnWidth(convertStrToPixel(item))}px` : `${getSavedColumnWidth(item)}px`,
                    }}
                  >
                    <Typography fontFamily="primaryFont" size={14}>
                      {item}
                    </Typography>
                  </th>
                );
              })}
            <th className="w-24 py-1.5 hidden sm:table-cell"></th>
          </tr>
        </thead>
        <tbody>
          {getErrorLoadingCode(error, loading, t)}
          {data &&
            data.map((item, index) => {
              return (
                <tr key={index} ref={(el) => (itemsRef.current[item.recordId] = el)} className={`${(index % 2 === 0 && "bg-gray-100") || ""} ${index === itemIndex ? "active" : ""}`} onClick={() => onRowClick(item)}>
                  {headerColumn().length > 0 && headerColumn().map((key, i) => (key === "Name" ? getRow(`${getValue(item[key])}`, "name-col pt-2", i) : getRowWithMobile(key, getValue(item[key]), i, "pt-2", maskingFields)))}
                  <td className="text-sm pb-2 sml:py-2">
                    <div className="flex buttons flex-nowrap items-center w-full justify-end">
                      {item.imageId ? (
                        <span className="mr-1.5" onClick={(e) => goToRecord(e, item)}>
                          <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.41699 5.97655C6.41699 6.55645 6.64736 7.1126 7.05741 7.52265C7.46746 7.9327 8.02361 8.16307 8.60351 8.16307C9.18341 8.16307 9.73956 7.9327 10.1496 7.52265C10.5597 7.1126 10.79 6.55645 10.79 5.97655C10.79 5.39665 10.5597 4.84051 10.1496 4.43045C9.73956 4.0204 9.18341 3.79004 8.60351 3.79004C8.02361 3.79004 7.46746 4.0204 7.05741 4.43045C6.64736 4.84051 6.41699 5.39665 6.41699 5.97655Z" fill="#295DA1" />
                            <path
                              d="M12.5065 1.89496H11.7392C11.6778 1.89278 11.6183 1.87246 11.5684 1.83656C11.5185 1.80066 11.4803 1.75078 11.4587 1.69322C11.0984 0.932897 10.7258 0.145752 9.91535 0.145752H7C6.37553 0.145752 6.0461 0.599381 5.44962 1.42326C5.22572 1.73054 5.15225 1.89496 4.9575 1.89496H1.45908C0.256207 1.89496 0.00315407 2.5999 0.00315407 3.19113V9.24807C-0.0103756 9.44301 0.0197361 9.63851 0.0912971 9.82035C0.162858 10.0022 0.274067 10.1658 0.416828 10.2992C0.559589 10.4326 0.730309 10.5326 0.916558 10.5917C1.10281 10.6508 1.2999 10.6677 1.49348 10.641H12.5065C12.7001 10.6677 12.8972 10.6508 13.0834 10.5917C13.2697 10.5326 13.4404 10.4326 13.5832 10.2992C13.7259 10.1658 13.8371 10.0022 13.9087 9.82035C13.9803 9.63851 14.0104 9.44301 13.9968 9.24807V3.19113C13.9968 2.5999 13.7385 1.89496 12.5065 1.89496ZM11.9561 5.97646C11.9561 6.63955 11.7595 7.28775 11.3911 7.83909C11.0227 8.39044 10.4991 8.82015 9.88645 9.07391C9.27383 9.32766 8.59972 9.39406 7.94937 9.26469C7.29902 9.13533 6.70164 8.81602 6.23276 8.34714C5.76388 7.87827 5.44457 7.28088 5.31521 6.63053C5.18585 5.98018 5.25224 5.30607 5.50599 4.69345C5.75975 4.08083 6.18947 3.55722 6.74081 3.18883C7.29215 2.82043 7.94035 2.6238 8.60344 2.6238C9.49234 2.62473 10.3446 2.97825 10.9731 3.6068C11.6017 4.23534 11.9552 5.08756 11.9561 5.97646ZM2.91851 4.08148C2.91851 4.22563 2.87576 4.36654 2.79568 4.4864C2.71559 4.60626 2.60176 4.69967 2.46858 4.75484C2.33541 4.81 2.18886 4.82444 2.04748 4.79631C1.9061 4.76819 1.77623 4.69878 1.6743 4.59685C1.57237 4.49492 1.50296 4.36505 1.47483 4.22367C1.44671 4.08229 1.46115 3.93574 1.51631 3.80256C1.57147 3.66939 1.66489 3.55556 1.78475 3.47547C1.9046 3.39539 2.04552 3.35264 2.18967 3.35264C2.38297 3.35264 2.56835 3.42943 2.70503 3.56611C2.84172 3.7028 2.91851 3.88818 2.91851 4.08148Z"
                              fill="#295DA1"
                            />
                            <path d="M1.46072 1.30258L3.20994 1.31191C3.28726 1.31191 3.36141 1.28119 3.41608 1.22652C3.47076 1.17185 3.50147 1.09769 3.50147 1.02037V0.874606C3.50147 0.642646 3.40933 0.420187 3.24531 0.256166C3.08129 0.0921457 2.85883 0 2.62687 0H2.0438C1.81184 0 1.58938 0.0921457 1.42536 0.256166C1.26134 0.420187 1.16919 0.642646 1.16919 0.874606V1.01104C1.16919 1.08836 1.1999 1.16252 1.25458 1.21719C1.30925 1.27186 1.3834 1.30258 1.46072 1.30258Z" fill="#295DA1" />
                          </svg>
                        </span>
                      ) : null}
                      <button className="whitespace-nowrap decoration hover:underline">
                        <Typography fontFamily="primaryFont" size={14} text="primary" weight="medium">
                          Quick View
                        </Typography>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <SidebarComponent isLoading={isLoading} profile={ssdiData} showSideBar={showSideBar} prevNext={prevNext} showSideBarAction={onRowClick} handlePrev={handlePrev} handleNext={handleNext} comparedTo={true} type={"records"} />
      { showPaymentModal &&
        <PaymentsModal
          showPaymentModal={showPaymentModal}
          setPaymentModal={setPaymentModal}
        />
      }
    </>
  );
};
export default Table;
