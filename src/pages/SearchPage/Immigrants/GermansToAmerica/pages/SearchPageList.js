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
  submitGermanForm,
  getGermanDropdownList,
  clearGermanFormQuery
} from "../../../../../redux/actions/germanToAmerica";
import { getLocationGUID } from "../../../../../redux/actions/ww1";
import { ssdi, updateContentCatalog } from "../../../../../redux/actions/sidebar";
import {
  getGermanToAmericaDefaultValue,
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
  updateResPlace,
  updateBirthPlace,
  updatePDepartPlace,
  updateIDestPlace,
} from "../../../utils/common";
import GermanToAmericaSearchForm from "../components/SearchForm";
import GermanToAmericaRefineSearch from "../components/RefineSearch";
import GermanTable from "../../../Table";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import { ListingPageheaderContent, PaginationResult } from "../../../../../utils/search";

const getValuesForm = (formValues) => {
  const _values = { ...formValues };
  let resObj = updateResPlace(_values),
    birthObj = updateBirthPlace(_values),
    pDepartObj = updatePDepartPlace(_values),
    iDestObj = updateIDestPlace(_values);
  return {
    ..._values,
    ...resObj,
    ...birthObj,
    ...pDepartObj,
    ...iDestObj,
    pn: _values?.pn,
    ps: _values?.ps,
  };
};
const setFormData = (
  setValues,
  _values,
  ResObj,
  birthObj,
  PDepartObj,
  iDestObj
) => {
  setValues({
    ...mergeDeep(getGermanToAmericaDefaultValue(), _values),
    ps: getPageSize(_values.ps),
    Res: {
      id: _values?.pr?.li?.i,
      name: _values?.pr?.l?.l,
      ...(ResObj ? { levelData: ResObj } : {}),
    },
    BirthPlace: {
      id: _values?.b?.li?.i,
      name: _values?.b?.l?.l,
      ...(birthObj ? { levelData: birthObj } : {}),
    },
    PDepart: {
      id: _values?.d?.li?.i,
      name: _values?.d?.l?.l,
      ...(PDepartObj ? { levelData: PDepartObj } : {}),
    },
    IDest: {
      id: _values?.id?.li?.i,
      name: _values?.id?.l?.l,
      ...(iDestObj ? { levelData: iDestObj } : {}),
    },
  });
};
const getData = async (search, history, setValues) => {
  if (search) {
    const _values = decodeDataToURL(search);
    let ResObj = null;
    let birthObj = null;
    let PDepartObj = null;
    let iDestObj = null;
    if (_values?.pr?.li?.i) {
      ResObj = await getLocationGUID(_values.pr?.li?.i);
    }
    if (_values?.b?.li?.i) {
      birthObj = await getLocationGUID(_values.b?.li?.i);
    }
    if (_values?.d?.li?.i) {
      PDepartObj = await getLocationGUID(_values.d?.li?.i);
    }
    if (_values?.id?.li?.i) {
      iDestObj = await getLocationGUID(_values.id?.li?.i);
    }
    setFormData(setValues, _values, ResObj, birthObj, PDepartObj, iDestObj);
  } else {
    history.push("/search/german-immigrants");
  }
};
const genarateUrl = (formValues, history, page = 1) => {
  const _values = { ...formValues };
  if (_values.Res) {
    delete _values.Res;
  }
  if (_values.BirthPlace) {
    delete _values.BirthPlace;
  }
  if (_values.PDepart) {
    delete _values.PDepart;
  }
  if (_values.IDest) {
    delete _values.IDest;
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
  const history = useHistory();
  const location = useLocation(),
   [values, setValues] = useState(null);
  const [valuesNew, setValuesNew] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const newRequest = useRef(true);
  const [tableSize, setTableSize] = useState(null);
  const [isPageLoad, setisPageLoad] = useState(true);
  const [tableColWidth, setTableColWidth] = useState([]);
  const [tableColTotal, setTableColTotal] = useState(0);
  const { totalRecords, maskingFields } = useSelector(
    (state) => {
      return state.germanToAmerica;
    }
  );
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const getGermanList = useCallback(
    (formValues = values) => {
      if (formValues !== null) {
        const _values = getValuesForm(formValues);
        dispatch(submitGermanForm(_values, newRequest.current));
      }
      newRequest.current = false;
    },
    [dispatch, values, newRequest]
  );
  useEffect(() => {
    dispatch(getGermanDropdownList());
  }, [dispatch]);
  useEffect(() => {
    getData(location.search, history, setValues);
  }, [setValues, location.search, history]);
  useEffect(() => {
    getGermanList();
    return () => {
      let pathName = history.location.pathname;
      if (pathName !== "/search/german-immigrants/result" && pathName.split("/")?.[1] !== "records") {
         localStorage.removeItem('switch_status');
         dispatch(updateContentCatalog())
         dispatch(clearGermanFormQuery())
      }
    }
  }, [dispatch,getGermanList]);
  const handleSubmitGermanToAmerica = (formValues) => {
    newRequest.current = true;
    setShowModal(false);
    genarateUrl(formValues, history);
  };
  const getGermanListPage = (page) => {
    let data = { ...values, pn: page };
    genarateUrl(data, history, page);
    setisPageLoad(false);
  };
  const changeLimit = (pageLimit) => {
    let data = { ...values, pn: 1, ps: pageLimit };
    genarateUrl(data, history);
    setisPageLoad(false);
  };
  const { germanList, loading, pageLoading, error } = useSelector(
    (state) => state.germanToAmerica
  );
  useEffect(() => {
    dispatch(ssdi({}));
  }, [dispatch]);

  const germanPageRecords = useMemo(() => {
    return pageRecordsCountfn(
      loading,
      error,
      totalRecords,
      values?.ps,
      values?.pn
    );
  }, [loading, error, totalRecords, values]);

  const buttonTitle = getButtonTitle(values);
  const handleShowGermanModal = (bool) => {
    let formValue = mergeDeep(getGermanToAmericaDefaultValue(), values);
    bool && setValuesNew(formValue);
    setShowModal(bool);
  };

  const handleShowModalNew = (bool) => {
    handleShowGermanModal(bool);
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
  const getGermanHtmlData = () => {
    if (loading) {
      return (
        <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
          <div className="absolute top-50 z-50 top-2/4 left-2/4">
            <Loader />
          </div>
        </div>
      );
    } else {
      return germanList.length === 0 ? (
        <Norecords
          searchResult={germanList}
          isLoading={false}
          firstName={getFirstName(values)}
        />
      ) : (
        <GermanTable
          data={germanList}
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
          <div className="fixed w-full h-full z-1000 left-0 bg-white bg-opacity-60 top-0">
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
                      handleShowGermanModal(true);
                    }}
                    title="Edit Search"
                    type="default"
                  />
                  <Button
                    handleClick={(e) => {
                      e.preventDefault();
                      handleShowModalNew(true);
                    }}
                    title="New Search"
                    type="default"
                  />
                </div>
              </div>
              <div>
                {germanPageRecords !== 0 && (
                  <p>
                    <Typography
                      fontFamily="primaryFont"
                      size={14}
                      text="secondary"
                      weight="light"
                    >
                      {PaginationResult(
                        t,
                        germanPageRecords,
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
                    {getGermanHtmlData()}
                  </div>
                </div>
                <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                  <TWPaginationComponent
                    currentPage={parseInt(values?.pn || 0)}
                    totalRecords={totalRecords}
                    limitPerPage={parseInt(values?.ps || 20)}
                    getList={getGermanListPage}
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
                  <GermanToAmericaRefineSearch
                    width={""}
                    handleSubmitGermanToAmerica={handleSubmitGermanToAmerica}
                    germanDefaultValues={values}
                    handleShowModal={handleShowGermanModal}
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
            <GermanToAmericaSearchForm
              inputWidth={""}
              width={"sm:w-1/2"}
              handleSubmitGermanToAmerica={handleSubmitGermanToAmerica}
              defaultValues={valuesNew}
              germanClear={false}
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
