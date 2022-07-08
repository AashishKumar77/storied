import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getPageSize,
  formDataTrim,
  getUSFederal1800DefaultValues,
  encodeDataToURL,
  USFederal1800PK,
} from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import MetaData from "../../../MetaData";
import USFederal1800BGImage from "../../../../../assets/images/Cemetery.jpg";
import "../../../index.css";
import {
  getContentCatalog,
  updateContentCatalog,
} from "../../../../../redux/actions/sidebar";
import { getUSFederal1800DropdownList } from "../../../../../redux/actions/usFedral1800"
import { useHistory } from "react-router-dom";
import USFederal1800SearchForm from "../components/SearchForm";

const SearchPage = () => {
  const defaultValues = getUSFederal1800DefaultValues();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });

  useEffect(() => {
    dispatch(getUSFederal1800DropdownList())
    dispatch(getContentCatalog({ partitionKey: USFederal1800PK }));
    return () => {
      dispatch(updateContentCatalog());
    };
  }, [dispatch]);

  const handleSubmitUSFederal1800 = (values, { setSubmitting }) => {
    setSubmitting(false);
    const usFederalUrlQuery = encodeDataToURL({
      ...formDataTrim(values),
      pn: 1,
      ps: getPageSize(),
      ci: USFederal1800PK
    });
    history.push("/search/1800-united-states-federal-census/result?" + usFederalUrlQuery);
  };
  return (
    <div className="main-container">
      <div className="pt-12 md:pt-14 h-full md:bg-transparent bg-white">
        <div className="tw-page-banner bg-gray-800 w-full relative md:absolute top-14 left-0 overflow-hidden hidden md:flex">
          <div className="banner flex text-center w-full justify-center">
            <div className="relative w-full">
              <div className="mask absolute bg-black w-full h-full left-0 top-0 bg-opacity-40"></div>
              <img
                src={USFederal1800BGImage}
                className="inline-block h-24 h-full w-full object-cover"
                alt="icon"
              />
            </div>
          </div>
        </div>
        <div className="bg-white tw-search-form-card md:rounded-2xl p-6 md:p-10 md:shadow-search-modal md:mt-10 md:mb-8 max-w-src-modal-w w-full mx-auto relative">
          <USFederal1800SearchForm
            title={
              contentCatalog?.collectionTitle
            }
            width={"md:w-1/2"}
            defaultValues={defaultValues}
            handleSubmitUSFederal1800={handleSubmitUSFederal1800}
            USFClear={true}
            buttonTitle={tr(t, "search.ww1.form.btn.search")}
          />
        </div>
        <MetaData />
      </div>
    </div>
  );
};
export default SearchPage;
