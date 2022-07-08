import React from 'react';
import { Link } from "react-router-dom";
import Typography from "./../../components/Typography"
import Banner1 from "../../assets/images/banner2.jpg";

const HistoricalNewspapers = ({ border = false, imageBackground }) => {
    
    return <>
        {
            <div>
            <div className="search-top bg-gray-800 w-full absolute top-12 md:top-14 left-0 overflow-hidden flex">
                <div className="banner flex text-center w-full justify-center">
                    <div className="relative w-full">
                        <div className="mask absolute bg-black w-full h-full left-0 top-0 bg-opacity-40"></div>
                        <img
                           src={imageBackground?imageBackground:Banner1} className="inline-block h-24 h-full w-full object-cover"
                            alt="icon"
                        />
                    </div>
                </div>
                <div className="text-center absolute w-full px-2 md:top-7 top-4 search-page-title">
                    <h1 className="cus-text-shadow">
                        <Typography size={24} weight="bold">Search</Typography>
                    </h1>
                </div>
            </div>
            <div className="xl:w-full xl:mx-0 h-12 relative md:mt-20 mt-14">
                <ul className="flex justify-center items-center typo-font-medium">
                    <li className="text-sm text-gray-300 flex items-center md:mr-12 mr-8 cursor-pointer" >
                        <div className={`flex items-center md:pb-2 pb-1 ${border ? "border-b-2":""}`}>
                            <Link to="/search" className={`font-normal ${border?"text-white":"text-gray-300 hover:text-white"}`}>
                                Historical Records
                        </Link>
                        </div>
                    </li>
                    <li className="text-sm text-gray-300 flex items-center cursor-pointer" >
                        <div className={`flex items-center md:pb-2 pb-1 ${border ? "" : "border-b-2"}`}>
                            <Link to="/search/newspapers" className={`font-normal ${border?"text-gray-300 hover:text-white":"text-white"}`}>
                                Newspapers
                             </Link>
                            <span className="bg-green-500 ml-3 h-5 w-16 rounded-md flex items-center justify-center text-xs text-white dark:text-gray-400 font-normal">Premium</span>
                        </div>
                    </li>
                </ul>
                </div>
            </div>
        }
    </>
}

export default HistoricalNewspapers