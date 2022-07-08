import React from 'react';
import { Link } from "react-router-dom";
import Translator from "../../components/Translator";
import { getQueryParam } from "../../components/utils";

const SearchPage = () => {
    const classes = "block hover:opacity-80 hover:text-white mx-4 bg-green-400 text-white px-4 py-2 rounded-lg";
    return <div className="container-sm mx-auto mt-20">
                <div className="flex flex-wrap flex-grow ">
                    <Link  to={`search/records${getQueryParam()}`}  className={classes}><Translator tkey="search.start.records"/></Link>
                    <Link  to={`search/universal_serach${getQueryParam()}`}  className={classes}><Translator tkey="search.start.unisearch"/></Link>
                    <Link  to={`search/wwi${getQueryParam()}`}  className={classes}><Translator tkey="search.start.wwi"/></Link>
                </div>
        </div>
}

export default SearchPage;