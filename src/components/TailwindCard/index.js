import React from 'react';
import { Link } from 'react-router-dom'



const Card = ({ heading, desc, to, type }) => {

    const content = <div id="header" className="flex">
        <div id="body" className="flex flex-col ml-5">
            <h4 id="name" className="text-xl font-semibold mb-2">{heading}</h4>
            <p id="job" className="text-gray-800 mt-2">{desc}</p>
        </div>
    </div>;
    return <>
        <div className="max-w-2xl bg-white border-2 border-gray-300 p-5 rounded-md tracking-wide shadow-lg m-2 ">
            {to ? <Link to={to}>{content}</Link> : content}
        </div>

    </>
}

export default Card;