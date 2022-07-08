import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../../components/Loader";
import Typography from "../../../../components/Typography";
import Button from "../../../../components/Button";
import { useHistory, useLocation } from "react-router-dom";
import TWPaginationComponent from "../../../../components/Pagination/TWPaginationComponent";
import TailwindModal from "../../../../components/TailwindModal";
import { submitWW2Form, getWWIIDropdownList, clearWwiiFormQuery } from "../../../../redux/actions/ww2";
import { getLocationGUID } from "../../../../redux/actions/ww1";
import { ssdi, updateContentCatalog } from "../../../../redux/actions/sidebar";
import WWIISearchForm from "../components/SearchForm";
import WWIIRefineSearch from "../components/RefineSearch";
import {
  getButtonTitle,
  getFirstName,
  decodeDataToURL,
  encodeDataToURL,
  getPageSize,
  mergeDeep,
  formDataTrim,
  getWWIIDefaultValue,
  pageRecordsCountfn
} from "../../../../utils";
import { useTranslation } from "react-i18next";
import Norecords from "../../NoRecord";
import "../../index.css";
import ClassNames from "classnames";
import WWIITable from "../../Table";
import {
  updateBirthPlace,
  updateEnlistPlaceNew,
  updateResidence,
} from "../../utils/common";
import { ListingPageheaderContent, PaginationResult } from "../../../../utils/search";

const getValuesForm = (formValues) => {
  const _values = { ...formValues };
  let birthObj = updateBirthPlace(_values),
    enlistObj = updateEnlistPlaceNew(_values),
    residenceObj = updateResidence(_values);
  return {
    ..._values,
    ...birthObj,
    ...enlistObj,
    ...residenceObj,
    pn: _values?.pn,
    ps: _values?.ps,
  };
};
const getData = async (search, history, setValues) => {
  if (search) {
    const _values = decodeDataToURL(search);
    let birthObj = null,
      enlistObj = null,
      residenceObj = null;
    if (_values?.b?.li?.i) {
      birthObj = await getLocationGUID(_values.b?.li?.i);
    }
    if (_values?.e?.li?.i) {
      enlistObj = await getLocationGUID(_values.e?.li?.i);
    }
    if (_values?.sr?.li?.i) {
      residenceObj = await getLocationGUID(_values.sr?.li?.i);
    }
    setValues({
      ...mergeDeep(getWWIIDefaultValue(), _values),
      ps: getPageSize(_values.ps),
      BirthPlace: {
        id: _values?.b?.li?.i,
        name: _values?.b?.l?.l,
        ...(birthObj ? { levelData: birthObj } : {}),
      },
      Enlist: {
        id: _values?.e?.li?.i,
        name: _values?.e?.l?.l,
        ...(enlistObj ? { levelData: enlistObj } : {}),
      },
      Residence: {
        id: _values?.sr?.li?.i,
        name: _values?.sr?.l?.l,
        ...(residenceObj ? { levelData: residenceObj } : {}),
      },
    });
  } else {
    history.push("/search/world-war-ii-army-enlistments");
  }
};
const genarateUrl = (formValues, history, page = 1) => {
  const _values = { ...formValues };
  if (_values.BirthPlace) {
    delete _values.BirthPlace;
  }
  if (_values.Enlist) {
    delete _values.Enlist;
  }
  if (_values.Residence) {
    delete _values.Residence;
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
  const location = useLocation(),
    [values, setValues] = useState(null);
  const [valuesNew, setValuesNew] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tableSize, setTableSize] = useState(null);
  const [isPageLoad, setisPageLoad] = useState(true);
  const newRequest = useRef(true);
  const [tableColWidth, setTableColWidth] = useState([]);
  const [tableColTotal, setTableColTotal] = useState(0);
  const history = useHistory();
  const { totalRecords, maskingFields } = useSelector(
    (state) => {
      return state.ww2;
    }
  );
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const getWW2List = useCallback(
    (formValues = values) => {
      if (formValues !== null) {
        const _values = getValuesForm(formValues);
        dispatch(submitWW2Form(_values, newRequest.current));
      }
      newRequest.current = false;
    },
    [dispatch, values, newRequest]
  );
  useEffect(() => {
    dispatch(getWWIIDropdownList());
  }, [dispatch]);

  useEffect(() => {
    getData(location.search, history, setValues);
  }, [setValues, location.search, history]);
  useEffect(() => {
    getWW2List();
    return () => {
      let pathName = history.location.pathname;
      if (pathName !== "/search/world-war-ii-army-enlistments/result" && pathName.split("/")?.[1] !== "records") {
        localStorage.removeItem('switch_status');
        dispatch(updateContentCatalog())
        dispatch(clearWwiiFormQuery())
      }
    }
  }, [dispatch, getWW2List]);
  const handleSubmitWWII = (formValues) => {
    newRequest.current = true;
    setShowModal(false);
    genarateUrl(formValues, history);
  };
  const getWW2ListPage = (page) => {
    let data = { ...values, pn: page };
    genarateUrl(data, history, page);
    setisPageLoad(false);
  };
  const changeLimit = (pageLimit) => {
    let data = { ...values, pn: 1, ps: pageLimit };
    genarateUrl(data, history);
    setisPageLoad(false);
  };
  const { ww2List, loading, pageLoading, error } = useSelector(
    (state) => state.ww2
  );
  useEffect(() => {
    dispatch(ssdi({}));
  }, [dispatch]);

  const WWIIPageRecords = useMemo(() => {
    return pageRecordsCountfn(
      loading,
      error,
      totalRecords,
      values?.ps,
      values?.pn
    );
  }, [loading, error, totalRecords, values]);


  const buttonTitle = getButtonTitle(values);

  const handleShowWWIIModal = (bool) => {
    let formValue = mergeDeep(getWWIIDefaultValue(), values);
    bool && setValuesNew(formValue);
    setShowModal(bool);
  };

  const handleShowWWIIModalNew = (bool) => {
    handleShowWWIIModal(bool);
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
  const getWWIIHtmlData = () => {
    if (loading) {
      return (
        <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
          <div className="absolute top-50 z-50 top-2/4 left-2/4">
            <Loader />
          </div>
        </div>
      );
    } else {
      return ww2List.length === 0 ? (
        <Norecords
          searchResult={ww2List}
          isLoading={false}
          firstName={getFirstName(values)}
        />
      ) : (
        <WWIITable
          data={ww2List}
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
      <div className="page-wrap ww-results-wrap">
        {pageLoading ? (
          <div className="fixed w-full h-full z-1000 left-0 bg-white top-0 bg-opacity-60">
            <div className="absolute top-50 z-50 top-2/4 left-2/4">
              <Loader />
            </div>
          </div>
        ) : (
          <div className="container mx-auto">
            <div className="head w-full  mb-4 text-center">
              {ListingPageheaderContent(contentCatalog?.collectionTitle)}
              <div className="edit-new-link-wrap text-center mb-5 sml:hidden">
                <div className="links w-full flex justify-center">
                  <Button
                    handleClick={(e) => {
                      e.preventDefault();
                      handleShowWWIIModal(true);
                    }}
                    title="Edit Search"
                    type="default"
                  />
                  <Button
                    handleClick={(e) => {
                      e.preventDefault();
                      handleShowWWIIModalNew(true);
                    }}
                    title="New Search"
                    type="default"
                  />
                </div>
              </div>
              <div>
                {WWIIPageRecords !== 0 && (
                  <p>
                    <Typography
                      fontFamily="primaryFont"
                      size={14}
                      text="secondary"
                      weight="light"
                    >
                      {PaginationResult(
                        t,
                        WWIIPageRecords,
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
                    {getWWIIHtmlData()}
                  </div>
                </div>
                <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                  <TWPaginationComponent
                    currentPage={parseInt(values?.pn || 0)}
                    totalRecords={totalRecords}
                    limitPerPage={parseInt(values?.ps || 20)}
                    getList={getWW2ListPage}
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
                  <WWIIRefineSearch
                    width={""}
                    handleSubmitWWII={handleSubmitWWII}
                    WWIIDefaultValues={values}
                    handleShowModal={handleShowWWIIModal}
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
            <WWIISearchForm
              inputWidth={""}
              width={"sm:w-1/2"}
              handleSubmitWWII={handleSubmitWWII}
              defaultValues={valuesNew}
              WWIIClear={false}
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
