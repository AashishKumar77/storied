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
  submitItaliansForm,
  getItaliansDropdownList,
  clearItaliansFormQuery
} from "../../../../../redux/actions/ItaliansToAmerica";
import { getLocationGUID } from "../../../../../redux/actions/ww1";
import { ssdi, updateContentCatalog } from "../../../../../redux/actions/sidebar";
import {
  getItaliansToAmericaDefaultValue,
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
import ItaliansToAmericaSearchForm from "../components/SearchForm";
import ItaliansToAmericaRefineSearch from "../components/RefineSearch";
import ItalianTable from "../../../Table";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import {
  ListingPageheaderContent,
  PaginationResult,
} from "../../../../../utils/search";
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
    ...mergeDeep(getItaliansToAmericaDefaultValue(), _values),
    ps: getPageSize(_values.ps),
    Res: {
      id: _values?.pr?.li?.i,
      name: _values?.pr?.l?.l,
      ...(ResObj ? { levelData: ResObj } : {}),
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
    BirthPlace: {
      id: _values?.b?.li?.i,
      name: _values?.b?.l?.l,
      ...(birthObj ? { levelData: birthObj } : {}),
    },
  });
};
const getData = async (search, history, setValues) => {
  if (search) {
    const _values = decodeDataToURL(search);
    let ResObj = null,
      PDepartObj = null,
      birthObj = null,
      iDestObj = null;
    if (_values?.b?.li?.i) {
      birthObj = await getLocationGUID(_values.b?.li?.i);
    }
    if (_values?.pr?.li?.i) {
      ResObj = await getLocationGUID(_values.pr?.li?.i);
    }
    if (_values?.id?.li?.i) {
      iDestObj = await getLocationGUID(_values.id?.li?.i);
    }
    if (_values?.d?.li?.i) {
      PDepartObj = await getLocationGUID(_values.d?.li?.i);
    }
    setFormData(setValues, _values, ResObj, birthObj, PDepartObj, iDestObj);
  } else {
    history.push("/search/italian-immigrants");
  }
};
const genarateUrl = (formValues, history, page = 1) => {
  const _values = { ...formValues };
  if (!_values.matchExact) {
    delete _values.matchExact;
  }
  if (_values.Res) {
    delete _values.Res;
  }
  if (_values.PDepart) {
    delete _values.PDepart;
  }
  if (_values.BirthPlace) {
    delete _values.BirthPlace;
  }
  if (!_values.fm.t) {
    delete _values.fm;
  }
  if (_values.IDest) {
    delete _values.IDest;
  }
  if (!_values.ln.t) {
    delete _values.ln;
  }
  history.push(`?${encodeDataToURL({ ...formDataTrim(_values), pn: page })}`);
};
const SearchPageList = () => {
  const location = useLocation(),
    [values, setValues] = useState(null),
    [valuesNew, setValuesNew] = useState(null),
    [showModal, setShowModal] = useState(false),
    newRequest = useRef(true),
    [tableSize, setTableSize] = useState(null),
    [isPageLoad, setisPageLoad] = useState(true),
    [tableColWidth, setTableColWidth] = useState([]),
    [tableColTotal, setTableColTotal] = useState(0),
    history = useHistory(),
    dispatch = useDispatch();
  const { t } = useTranslation();
  const { totalRecords, maskingFields } = useSelector(
    (state) => {
      return state.italiansToAmerica;
    }
  );
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  const getitalianList = useCallback(
    (formValues = values) => {
      if (formValues !== null) {
        const _values = getValuesForm(formValues);
        dispatch(submitItaliansForm(_values, newRequest.current));
      }
      newRequest.current = false;
    },
    [dispatch, values, newRequest]
  );
  useEffect(() => {
    dispatch(getItaliansDropdownList());
  }, [dispatch]);
  useEffect(() => {
    getData(location.search, history, setValues);
  }, [setValues, location.search, history]);
  useEffect(() => {
    getitalianList();
    return () => {
      let pathName = history.location.pathname;
      if (pathName !== "/search/italian-immigrants/result" && pathName.split("/")?.[1] !== "records") {
        localStorage.removeItem('switch_status');
        dispatch(updateContentCatalog())
        dispatch(clearItaliansFormQuery())
      }
    }
  }, [dispatch,getitalianList]);
  const handleSubmitForm = (formValues) => {
    newRequest.current = true;
    setShowModal(false);
    genarateUrl(formValues, history);
  };
  const getItalianListPage = (page) => {
    let data = { ...values, pn: page };
    genarateUrl(data, history, page);
    setisPageLoad(false);
  };
  const changeLimit = (pageLimit) => {
    let data = { ...values, pn: 1, ps: pageLimit };
    genarateUrl(data, history);
    setisPageLoad(false);
  };
  const { italianList, loading, pageLoading, error } = useSelector(
    (state) => state.italiansToAmerica
  );
  useEffect(() => {
    dispatch(ssdi({}));
  }, [dispatch]);
  const italianPageRecords = useMemo(() => {
    return pageRecordsCountfn(
      loading,
      error,
      totalRecords,
      values?.ps,
      values?.pn
    );
  }, [loading, error, totalRecords, values]);
  const buttonTitle = getButtonTitle(values),
    handleShowModal = (bool) => {
      let formValue = mergeDeep(getItaliansToAmericaDefaultValue(), values);
      bool && setValuesNew(formValue);
      setShowModal(bool);
    },
    handleShowModalNew = (bool) => {
      handleShowModal(bool);
    },
    getTableSize = (width) => {
      setTableSize(width);
    };
  const handleTableColWidth = (width) => {
      setTableColWidth(width);
    },
    handleTableColTotal = (width) => {
      setTableColTotal(width);
    };
  const getItalianHtmlData = () => {
    if (loading) {
      return (
        <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
          <div className="absolute top-50 z-50 top-2/4 left-2/4">
            <Loader />
          </div>
        </div>
      );
    } else {
      return italianList.length === 0 ? (
        <Norecords
          searchResult={italianList}
          isLoading={false}
          firstName={getFirstName(values)}
        />
      ) : (
        <ItalianTable
          loading={loading}
          data={italianList}
          maskingFields={maskingFields}
          error={error}
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
          <div className="fixed w-full h-full z-1000 left-0 top-0 bg-opacity-60 bg-white">
            <div className="absolute top-50 z-50 left-2/4 top-2/4">
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
                    type="default"
                    title="Edit Search"
                    handleClick={(e) => {
                      e.preventDefault();
                      handleShowModal(true);
                    }}
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
                {italianPageRecords !== 0 && (
                  <p>
                    <Typography
                      fontFamily="primaryFont"
                      size={14}
                      text="secondary"
                      weight="light"
                    >
                      {PaginationResult(
                        t,
                        italianPageRecords,
                        values?.ps,
                        values?.pn,
                        totalRecords
                      )}
                    </Typography>
                  </p>
                )}
              </div>
            </div>
            <div className="ww-grid">
              <div className="relative ww-col-right">
                <div className="flex">
                  <div className="table-content bg-white sm:rounded-lg sm:shadow text-left">
                    {getItalianHtmlData()}
                  </div>
                </div>
                <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                  <TWPaginationComponent
                    currentPage={parseInt(values?.pn || 0)}
                    totalRecords={totalRecords}
                    limitPerPage={parseInt(values?.ps || 20)}
                    getList={getItalianListPage}
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
                  <ItaliansToAmericaRefineSearch
                    width={""}
                    handleSubmitForm={handleSubmitForm}
                    italianDefaultValues={values}
                    handleShowModal={handleShowModal}
                    buttonTitle="Update"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <TailwindModal
          title={contentCatalog?.collectionTitle}
          showClose={true}
          content={
            <ItaliansToAmericaSearchForm
              inputWidth={""}
              width={"sm:w-1/2"}
              buttonTitle={buttonTitle}
              italianClear={false}
              handleSubmitForm={handleSubmitForm}
              defaultValues={valuesNew}
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
