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
import { getLocationGUID } from "../../../../../redux/actions/ww1";
import { ssdi, updateContentCatalog } from "../../../../../redux/actions/sidebar";
import {
  getRussianDefaultValue,
  pageRecordsCountfn,
  getButtonTitle,
  getFirstName,
  decodeDataToURL,
  encodeDataToURL,
  getPageSize,
  mergeDeep,
  formDataTrim,
} from "../../../../../utils";
import {
  ListingPageheaderContent,
  PaginationResult
} from "../../../../../utils/search";

import RussianTable from "../../../Table";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import {
  updateArrivalPlace,
  updateBirthPlace,
  updateDepartPlace,
  updateResidencePlace,
} from "../../../utils/common";
import {
  getRussianDropdownList,
  submitRussianForm,
  clearRussianFormQuery
} from "../../../../../redux/actions/russian";
import RussianSearchForm from "../components/SearchForm";
import RussianRefineSearch from "../components/RefineSearch";

const getValuesForm = (formValues) => {
  const _values = { ...formValues };

  let birthObj = updateBirthPlace(_values),
    arrivalObj = updateArrivalPlace(_values),
    departObj = updateDepartPlace(_values),
    resObj = updateResidencePlace(_values);
  return {
    ..._values,
    ...birthObj,
    ...arrivalObj,
    ...departObj,
    ...resObj,
    pn: _values?.pn,
    ps: _values?.ps,
  };
};
const setFormData = (
  setValues,
  _values,
  BirthObj,
  ArrivalObj,
  DepartObj,
  ResObj
) => {
  setValues({
    ...mergeDeep(getRussianDefaultValue(), _values),
    ps: getPageSize(_values.ps),
    BirthPlace: {
      id: _values?.b?.li?.i,
      name: _values?.b?.l?.l,
      ...(BirthObj ? { levelData: BirthObj } : {}),
    },
    ArrivalPlace: {
      id: _values?.a?.li?.i,
      name: _values?.a?.l?.l,
      ...(ArrivalObj ? { levelData: ArrivalObj } : {}),
    },
    Depart: {
      id: _values?.d?.li?.i,
      name: _values?.d?.l?.l,
      ...(DepartObj ? { levelData: DepartObj } : {}),
    },
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
    let BirthObj = null,
      ArrivalObj = null,
      DepartObj = null,
      ResObj = null;
    if (_values?.b?.li?.i) {
      BirthObj = await getLocationGUID(_values.b?.li?.i);
    }
    if (_values?.a?.li?.i) {
      ArrivalObj = await getLocationGUID(_values.a?.li?.i);
    }
    if (_values?.d?.li?.i) {
      DepartObj = await getLocationGUID(_values.d?.li?.i);
    }
    if (_values?.r?.li?.i) {
      ResObj = await getLocationGUID(_values.r?.li?.i);
    }
    setFormData(setValues, _values, BirthObj, ArrivalObj, DepartObj, ResObj);
  } else {
    history.push("/search/russian-immigrants");
  }
};
const genarateUrl = (formValues, history, page = 1) => {
  const _values = { ...formValues };
  if (_values.BirthPlace) {
    delete _values.BirthPlace;
  }
  if (_values.ArrivalPlace) {
    delete _values.ArrivalPlace;
  }
  if (_values.Depart) {
    delete _values.Depart;
  }
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
  const [values, setValues] = useState(null);
  const [valuesNew, setValuesNew] = useState(null);
  const newRequest = useRef(true);
  const [tableSize, setTableSize] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isPageLoad, setisPageLoad] = useState(true);
  const [tableColWidth, setTableColWidth] = useState([]);
  const [tableColTotal, setTableColTotal] = useState(0);
  const history = useHistory();
  const { totalRecords, maskingFields } = useSelector(
    (state) => {
      return state.russian;
    }
  );
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const getRussianList = useCallback(
    (formValues = values) => {
      if (formValues !== null) {
        const _values = getValuesForm(formValues);
        dispatch(submitRussianForm(_values, newRequest.current));
      }
      newRequest.current = false;
    },
    [dispatch, values, newRequest]
  );
  useEffect(() => {
    dispatch(getRussianDropdownList());
  }, [dispatch]);
  useEffect(() => {
    getData(location.search, history, setValues);
  }, [setValues, location.search, history]);
  useEffect(() => {
    getRussianList();
    return () => {
      let pathName = history.location.pathname;
      if (pathName !== "/search/russian-immigrants/result" && pathName.split("/")?.[1] !== "records") {
        localStorage.removeItem('switch_status');
        dispatch(updateContentCatalog())
        dispatch(clearRussianFormQuery())
      }
    }
  },[dispatch,getRussianList]);
  const handleSubmitRussian = (formValues) => {
    newRequest.current = true;
    setShowModal(false);
    genarateUrl(formValues, history);
  };
  const getRussianListPage = (page) => {
    let data = { ...values, pn: page };
    genarateUrl(data, history, page);
    setisPageLoad(false);
  };
  const changeLimit = (pageLimit) => {
    let data = { ...values, pn: 1, ps: pageLimit };
    genarateUrl(data, history);
    setisPageLoad(false);
  };
  const { russianList, loading, pageLoading, error } = useSelector(
    (state) => state.russian
  );
  useEffect(() => {
    dispatch(ssdi({}));
  }, [dispatch]);

  const russianPageRecords = useMemo(() => {
    return pageRecordsCountfn(
      loading,
      error,
      totalRecords,
      values?.ps,
      values?.pn
    );
  }, [loading, error, totalRecords, values]);

  const buttonTitle = getButtonTitle(values);

  const handleShowRussianModal = (bool) => {
    let formValue = mergeDeep(getRussianDefaultValue(), values);
    bool && setValuesNew(formValue);
    setShowModal(bool);
  };

  const handleShowRussianModalNew = (bool) => {
    handleShowRussianModal(bool);
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
  const getRussianHtmlData = () => {
    if (loading) {
      return (
        <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
          <div className="absolute top-50 z-50 top-2/4 left-2/4">
            <Loader />
          </div>
        </div>
      );
    } else {
      return russianList.length === 0 ? (
        <Norecords
          searchResult={russianList}
          isLoading={false}
          firstName={getFirstName(values)}
        />
      ) : (
        <RussianTable
          data={russianList}
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
      <div className="page-wrap ww-results-wrap" id="russian-form">
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
                      handleShowRussianModal(true);
                    }}
                    title="Edit Search"
                    type="default"
                  />
                  <Button
                    handleClick={(e) => {
                      e.preventDefault();
                      handleShowRussianModalNew(true);
                    }}
                    title="New Search"
                    type="default"
                  />
                </div>
              </div>
              <div>
                {russianPageRecords !== 0 && (
                  <p>
                    <Typography
                      fontFamily="primaryFont"
                      size={14}
                      text="secondary"
                      weight="light"
                    >
                      {PaginationResult(
                        t,
                        russianPageRecords,
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
                    {getRussianHtmlData()}
                  </div>
                </div>
                <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                  <TWPaginationComponent
                    currentPage={parseInt(values?.pn || 0)}
                    totalRecords={totalRecords}
                    limitPerPage={parseInt(values?.ps || 20)}
                    getList={getRussianListPage}
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
                  <RussianRefineSearch
                    width={""}
                    handleSubmitRussian={handleSubmitRussian}
                    russianDefaultValues={values}
                    handleShowModal={handleShowRussianModal}
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
            <RussianSearchForm
              inputWidth={""}
              width={"sm:w-1/2"}
              handleSubmitRussian={handleSubmitRussian}
              defaultValues={valuesNew}
              russiaClear={false}
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
