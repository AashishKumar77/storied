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
  submitIrishForm,
  getIrishDropdownList,
  clearIrishFormQuery
} from "../../../../../redux/actions/irish";
import { getLocationGUID } from "../../../../../redux/actions/ww1";
import { ssdi, updateContentCatalog } from "../../../../../redux/actions/sidebar";
import {
  getIrishDefaultValue,
  pageRecordsCountfn,
  getButtonTitle,
  getFirstName,
  decodeDataToURL,
  encodeDataToURL,
  getPageSize,
  mergeDeep,
  formDataTrim,
} from "../../../../../utils";
import { updateResPlace, updatePDepartPlace, updateIDestPlace } from "../../../utils/common";
import IrishSearchForm from "../components/SearchForm";
import IrishRefineSearch from "../components/RefineSearch";
import IrishTable from "../../../Table";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import { ListingPageheaderContent, PaginationResult } from "../../../../../utils/search";

const getValuesForm = (formValues) => {
  const _values = { ...formValues };
  let resObj = updateResPlace(_values),
    pDepartObj = updatePDepartPlace(_values),
    iDestObj = updateIDestPlace(_values);
  return {
    ..._values,
    ...resObj,
    ...pDepartObj,
    ...iDestObj,
    pn: _values?.pn,
    ps: _values?.ps,
  };
};
const setFormData = (setValues, _values, ResObj, IDestObj, PDepartObj) => {
  setValues({
    ...mergeDeep(getIrishDefaultValue(), _values),
    ps: getPageSize(_values.ps),
    Res: {
      id: _values?.pr?.li?.i,
      name: _values?.pr?.l?.l,
      ...(ResObj ? { levelData: ResObj } : {}),
    },
    IDest: {
      id: _values?.id?.li?.i,
      name: _values?.id?.l?.l,
      ...(IDestObj ? { levelData: IDestObj } : {}),
    },
    PDepart: {
      id: _values?.d?.li?.i,
      name: _values?.d?.l?.l,
      ...(PDepartObj ? { levelData: PDepartObj } : {}),
    },
  });
};
const getData = async (search, history, setValues) => {
  if (search) {
    const _values = decodeDataToURL(search);
    let ResObj = null;
    let IDestObj = null;
    let PDepartObj = null;
    if (_values?.pr?.li?.i) {
      ResObj = await getLocationGUID(_values.pr?.li?.i);
    }
    if (_values?.id?.li?.i) {
      IDestObj = await getLocationGUID(_values.id?.li?.i);
    }
    if (_values?.d?.li?.i) {
      PDepartObj = await getLocationGUID(_values.d?.li?.i);
    }
    setFormData(setValues, _values, ResObj, IDestObj, PDepartObj);
  } else {
    history.push("/search/irish-famine-passenger-records");
  }
};
const genarateUrl = (formValues, history, page = 1) => {
  const _values = { ...formValues };

  if (_values.Res) {
    delete _values.Res;
  }
  if (_values.IDest) {
    delete _values.IDest;
  }
  if (_values.PDepart) {
    delete _values.PDepart;
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
  const [values, setValues] = useState(null),
   [valuesNew, setValuesNew] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tableSize, setTableSize] = useState(null);
  const newRequest = useRef(true);
  const [isPageLoad, setisPageLoad] = useState(true);
  const [tableColWidth, setTableColWidth] = useState([]);
  const [tableColTotal, setTableColTotal] = useState(0);
  const history = useHistory();
  const { totalRecords, maskingFields } = useSelector(
    (state) => {
      return state.irish;
    }
  );
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const getIrishList = useCallback(
    (formValues = values) => {
      if (formValues !== null) {
        const _values = getValuesForm(formValues);
        dispatch(submitIrishForm(_values, newRequest.current));
      }
      newRequest.current = false;
    },
    [dispatch, values, newRequest]
  );
  useEffect(() => {
    dispatch(getIrishDropdownList());
  }, [dispatch]);

  useEffect(() => {
    getData(location.search, history, setValues);
  }, [setValues, location.search, history]);
  useEffect(() => {
    getIrishList();
    return () => {
      let pathName = history.location.pathname;
      if (pathName !== "/search/irish-famine-passenger-records/result" && pathName.split("/")?.[1] !== "records") {
        localStorage.removeItem('switch_status');
        dispatch(updateContentCatalog())
        dispatch(clearIrishFormQuery())
      }
    }
  }, [dispatch,getIrishList]);
  const handleSubmitIrish = (formValues) => {
    newRequest.current = true;
    setShowModal(false);
    genarateUrl(formValues, history);
  };
  const getIrishListPage = (page) => {
    let data = { ...values, pn: page };
    genarateUrl(data, history, page);
    setisPageLoad(false);
  };
  const changeLimit = (pageLimit) => {
    let data = { ...values, pn: 1, ps: pageLimit };
    genarateUrl(data, history);
    setisPageLoad(false);
  };
  const { irishList, loading, pageLoading, error } = useSelector(
    (state) => state.irish
  );
  useEffect(() => {
    dispatch(ssdi({}));
  }, [dispatch]);
  const IrishPageRecords = useMemo(() => {
    return pageRecordsCountfn(
      loading,
      error,
      totalRecords,
      values?.ps,
      values?.pn
    );
  }, [loading, error, totalRecords, values]);


  const buttonTitle = getButtonTitle(values);

  const handleIrishShowModal = (bool) => {
    let formValue = mergeDeep(getIrishDefaultValue(), values);
    bool && setValuesNew(formValue);
    setShowModal(bool);
  };

  const handleIrishShowModalNew = (bool) => {
    handleIrishShowModal(bool);
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
  const getIrishHtmlData = () => {
    if (loading) {
      return (
        <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
          <div className="absolute top-50 z-50 top-2/4 left-2/4">
            <Loader />
          </div>
        </div>
      );
    } else {
      return irishList.length === 0 ? (
        <Norecords
          searchResult={irishList}
          isLoading={false}
          firstName={getFirstName(values)}
        />
      ) : (
        <IrishTable
          data={irishList}
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
      <div className="page-wrap ww-results-wrap" id="irish-form">
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
                      handleIrishShowModal(true);
                    }}
                    title="Edit Search"
                    type="default"
                  />
                  <Button
                    handleClick={(e) => {
                      e.preventDefault();
                      handleIrishShowModalNew(true);
                    }}
                    title="New Search"
                    type="default"
                  />
                </div>
              </div>
              <div>
                {IrishPageRecords !== 0 && (
                  <p>
                    <Typography
                      fontFamily="primaryFont"
                      size={14}
                      text="secondary"
                      weight="light"
                    >
                      {PaginationResult(
                        t,
                        IrishPageRecords,
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
                    {getIrishHtmlData()}
                  </div>
                </div>
                <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                  <TWPaginationComponent
                    currentPage={parseInt(values?.pn || 0)}
                    totalRecords={totalRecords}
                    limitPerPage={parseInt(values?.ps || 20)}
                    getList={getIrishListPage}
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
                  <IrishRefineSearch
                    width={""}
                    handleSubmitIrish={handleSubmitIrish}
                    irishDefaultValues={values}
                    handleShowModal={handleIrishShowModal}
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
            <IrishSearchForm
              inputWidth={""}
              width={"sm:w-1/2"}
              handleSubmitIrish={handleSubmitIrish}
              defaultValues={valuesNew}
              IrishClear={false}
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
