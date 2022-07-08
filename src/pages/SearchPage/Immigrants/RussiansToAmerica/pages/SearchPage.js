import React, { useEffect } from "react";
import SearchForm from "../components/SearchForm";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { getRussianDropdownList } from "../../../../../redux/actions/russian";
import {
  getContentCatalog,
  updateContentCatalog,
} from "../../../../../redux/actions/sidebar";
import {
  encodeDataToURL,
  formDataTrim,
  getPageSize,
  getRussianDefaultValue,
  russianPK,
} from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import BannerTop from "../../../../../assets/images/germans-to-america-banner.jpg";
import MetaData from "../../../MetaData";
import "../../../index.css";
import { useHistory } from "react-router-dom";
const SearchPage = () => {
  const defaultValues = getRussianDefaultValue();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { contentCatalog } = useSelector((state) => state.sidebar);
  useEffect(() => {
    dispatch(getRussianDropdownList());
    dispatch(getContentCatalog({ partitionKey: russianPK }));
    return () => {
      dispatch(updateContentCatalog());
    };
  }, [dispatch]);
  const handleSubmitRussian = (formValue, { setSubmitting }) => {
    setSubmitting(false);
    const russianUrlQuery = encodeDataToURL({
      ...formDataTrim(formValue),
      pn: 1,
      ps: getPageSize(),
      ci: russianPK
    });
    history.push("/search/russian-immigrants/result?" + russianUrlQuery);
  };
  return (
    <div className="main-container">
      <div className="pt-12 md:pt-14 h-full md:bg-transparent bg-white">
        <div className="tw-page-banner bg-gray-800 w-full relative md:absolute top-14 left-0 overflow-hidden hidden md:flex">
          <div className="banner flex text-center w-full justify-center">
            <div className="relative w-full">
              <div className="mask absolute bg-black w-full h-full left-0 top-0 bg-opacity-40"></div>
              <img
                className="inline-block h-24 h-full w-full object-cover"
                src={BannerTop}
                alt="icon"
              />
            </div>
          </div>
        </div>
        <div className="bg-white tw-search-form-card md:rounded-2xl p-6 md:p-10 md:shadow-search-modal md:mt-10 md:mb-8 max-w-src-modal-w w-full mx-auto relative">
          <SearchForm
            title={
              contentCatalog?.collectionTitle ||
              "Russian Immigrants to US, 1834-1897"
            }
            width={"md:w-1/2"}
            defaultValues={defaultValues}
            handleSubmitRussian={handleSubmitRussian}
            russiaClear={true}
            buttonTitle={tr(t, "search.ww1.form.btn.search")}
          />
        </div>
        <MetaData />
      </div>
    </div>
  );
};

export default SearchPage;
