import React from "react";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { numToLocaleString } from "./../../utils";
import Typography from "./../../components/Typography"
import "./index.css";
const MetaData = () => {
    const { contentCatalog, isLoading } = useSelector((state) => {
        return state.sidebar;
    });
    const getMetaHtmlHeader = () => {
        const html = <Typography  size={12}  text="secondary"><span dangerouslySetInnerHTML={{__html: contentCatalog.collectionDescription}}></span></Typography>
        return <div className="uw-description-col mb-5">
                <h2 className="mb-2"><Typography  text="secondary"  weight="medium">Description</Typography></h2>
                <p className="info">{html}</p>
            </div>
    }
    const getMetaHtmlSource = () => {
        const text = contentCatalog.citation.replace(/(\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z09+&@#\/%=~_|])/img, '<a href="$1" target="_blank">$1</a>');
        return <div className="uw-description-col mb-5">
            <h2 className="mb-2"><Typography  text="secondary"  weight="medium">Source Citation</Typography></h2>                
                <p className="info">
                <Typography  size={12}  text="secondary"><span dangerouslySetInnerHTML={{__html: text}}></span></Typography></p>
            </div>
    }
    const getCount = (count) => {
        if( count ) {
            return numToLocaleString(count)
        } else {
            return '0';
        }
    }
    const getMetaHtmlDetails = () => {
        return <div className="uw-details-col">
            <h3 className="mb-2"><Typography  text="secondary"  weight="medium">Details</Typography></h3>                
            <ul className="md:flex">
                <li className="md:mr-10"><Typography size={12} text="secondary">{getCount(contentCatalog.recordCount)} Records</Typography></li>
                <li className="md:mr-10"><Typography size={12} text="secondary">{getCount(contentCatalog.imageCount)} Images</Typography></li>
                <li className="md:mr-10"><Typography size={12} text="secondary">{contentCatalog.collectionTimePeriod}</Typography></li>
                <li className="md:mr-10"><Typography size={12} text="secondary">{contentCatalog.collectionLocation}</Typography></li>
            </ul>
        </div>
    }
    return <>
    {isLoading && (
      <div className="bg-white md:rounded-2xl px-6 p-10 pb-7 md:p-10 md:mb-8 md:shadow-search-modal max-w-src-modal-w w-full mx-auto border-t border-gray-300 md:border-0">
        <Loader />
      </div>
    )}
    {!isLoading && contentCatalog && (
      <div className="bg-white md:rounded-2xl px-6 p-10 pb-7 md:p-10 md:mb-8 md:shadow-search-modal max-w-src-modal-w w-full mx-auto border-t border-gray-300 md:border-0">
        {getMetaHtmlHeader()}
        {getMetaHtmlSource()}
        {getMetaHtmlDetails()}
      </div>
    )}
  </>
}
export default MetaData