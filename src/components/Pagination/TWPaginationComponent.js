import React, { useState, useEffect } from "react";
import className from "classnames";
import { Formik, Field } from "formik";
import Typography from "./../../components/Typography";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { calculatePager } from "./getPager";
import { tr } from "../../components/utils";
import { useTranslation } from "react-i18next";
import { numToLocaleString } from "./../../utils";
const addTableClass = (size) => {
  let str = "";
  if (size && size < 640) {
    str = "flex-col";
  }
  return str;
};
const editTableClass = (size) => {
  let str = "sml:justify-start";
  if (size && size < 640) {
    str = "mb-5";
  }
  return str;
};
const getVisible = (visible, size) => {
  let result = visible;
  if (size && size <= 479) {
    result = 5;
  }
  return result;
};
const TWPaginationComponent = ({
  getList,
  currentPage,
  limitPerPage,
  totalRecords,
  changeLimit,
  visible = 7,
  tableSize,
  classPagination = ""
}) => {
  const rows = [10, 20, 50, 100];
  const current = parseInt(currentPage);
  const [lastPage, setLastPage] = useState(
    Math.ceil(totalRecords / limitPerPage)
  );
  const { t } = useTranslation();
  useEffect(() => {
    setLastPage(Math.ceil(totalRecords / limitPerPage));
  }, [limitPerPage, totalRecords, setLastPage]);
  const pageClickHandler = (e, page) => {
    e.preventDefault();
    getList(page);
  };
  let pageRecords = limitPerPage * currentPage;
  pageRecords = totalRecords > pageRecords ? pageRecords : totalRecords;
  const getPrevious = (bool) => {
    const html = (
      <>
        <span className="sr-only">Previous</span>
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </>
    );
    return bool ? (
      <Link
        to="#"
        onClick={(e) => pageClickHandler(e, current - 1)}
        className="relative cursor-pointer inline-flex items-center px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        {html}
      </Link>
    ) : (
      <Link
        to="#"
        className="relative pointer-events-none opacity-30 inline-flex items-center px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        {html}
      </Link>
    );
  };
  const getNext = (bool) => {
    const html = (
      <>
        <span className="sr-only">Next</span>
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </>
    );
    return bool ? (
      <Link
        to="#"
        onClick={(e) => pageClickHandler(e, current + 1)}
        className="relative cursor-pointer inline-flex items-center px-2 py-1.5 rounded-r-md text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        {html}
      </Link>
    ) : (
      <Link
        to="#"
        className="relative pointer-events-none opacity-30 inline-flex items-center px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        {html}
      </Link>
    );
  };
  const getLink = (page, i) => {
    const linkPage =
      page !== current ? { onClick: (e) => pageClickHandler(e, page) } : {};
    return (
      <Link
        key={i}
        to="#"
        {...linkPage}
        aria-current="page"
        className={className({
          "text-gray-700 rounded-lg relative inline-flex items-center px-3.5 py-1.5": true,
          "z-10 bg-gray-300": current === page,
          "hover:bg-gray-50": current !== page,
          "cursor-pointer": page !== current,
          "cursor-default pointer-events-none": page === current,
        })}
      >
        <Typography size={14} text="secondary">
          {numToLocaleString(page)}
        </Typography>
      </Link>
    );
  };
  const getNumbers = () => {
    const { aboveSpan, afterSpan, startNumer, endNumber } = calculatePager(
      lastPage,
      current,
      getVisible(visible, tableSize)
    );
    return (
      <>
        {getLink(1)}
        {aboveSpan && (
          <span className="relative inline-flex items-center px-4 py-1.5 text-sm font-medium text-gray-700">
            ...
          </span>
        )}
        {Array.from({ length: endNumber }, (_, i) => i + startNumer).map(
          (e, i) => {
            return getLink(parseInt(e), i);
          }
        )}
        {afterSpan && (
          <span className="relative inline-flex items-center px-4 py-1.5 text-sm font-medium text-gray-700">
            ...
          </span>
        )}
        {lastPage !== 1 && getLink(lastPage)}
      </>
    );
  };

  return totalRecords > 0 ? (
    <div className="pt-5 flex items-center justify-between lg:px-3">
      <div
        className={`flex-1 flex items-center md:justify-between w-full ${classPagination} ${addTableClass(
          tableSize
        )}`}
      >
        <div
          className={`flex w-full items-center justify-center ${editTableClass(
            tableSize
          )} pt-2 md:pt-0`}
        >
          <p className="px-1">
            <Typography size={14} text="secondary">
              {`${numToLocaleString(
                limitPerPage * (currentPage - 1) + 1
              )}-${numToLocaleString(pageRecords)}`}{" "}
              {tr(t, "search.ww1.list.rpagination")}{" "}
              {numToLocaleString(totalRecords)}
            </Typography>
          </p>
          <div className="ml-5 flex">
            <Typography size={14} text="secondary">
              {tr(t, "search.ww1.list.row-per-page")}
            </Typography>
            <div className="relative ml-3">
              <Formik
                enableReinitialize={true}
                initialValues={{ rows: limitPerPage }}
              >
                <div className="relative">
                  <Field
                    name="rows"
                    className="block appearance-none text-gray-700 pl-1 pr-3.5 bg-transparent rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                    id="grid-rows"
                    placeholder="Select"
                    onChange={(e) => changeLimit(parseInt(e.target.value))}
                    as="select"
                  >
                    {rows.map((row, index) => (
                      <option key={`${index}`} value={row}>
                        {row}
                      </option>
                    ))}
                  </Field>
                  <div className="pointer-events-none absolute inset-y-0 top-0.5 right-0 flex items-center text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </Formik>
            </div>
          </div>
        </div>
        <div className="text-center">
          <nav
            className="relative z-0 inline-flex -space-x-px"
            aria-label="Pagination"
          >
            {getPrevious(current !== 1)}
            {getNumbers()}
            {getNext(current !== lastPage)}
          </nav>
        </div>
      </div>
    </div>
  ) : null;
};
TWPaginationComponent.propTypes = {
  limitPerPage: PropTypes.oneOf([10, 20, 50, 100]),
  getList: PropTypes.func,
  currentPage: PropTypes.number,
  totalRecords: PropTypes.number,
  changeLimit: PropTypes.func,
  visible: PropTypes.number,
  tableSize: PropTypes.number,
};

export default TWPaginationComponent;
