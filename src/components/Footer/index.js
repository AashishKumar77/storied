import React,{useEffect,useState} from "react";
import  {useLocation} from 'react-router-dom';
import "./index.css";
const Footer = () => {
   const [showFooter,setShowFooter]=useState(true)
    const location=useLocation();
    let pathArr=location.pathname.split('/');
    pathArr.shift();
    useEffect(()=>{
       let  condArr=['ut','ssdi','newspaper','census'];
       if(condArr.includes(pathArr[0].toLowerCase())) setShowFooter(false);
    },[location])
    return showFooter?<div className="py-4 bg-white footer">
    <div className="main-wrapper mx-auto">
        <div className="items-center space-x-6 footer-links">
            <a href="!#" rel="noreferrer" className="text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-inset">About Us</a>
            <a href="!#" rel="noreferrer" className="text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-inset">Contact Us</a>
            <a href="!#" rel="noreferrer" className="text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-inset">Terms of Use</a>
            <a href="!#" rel="noreferrer" className="text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-inset">Privacy</a>
            <a href="!#" rel="noreferrer" className="text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-inset">Sitemap</a>
        </div>
        <div className="mt-3 mb-2 text-xs copy">© Copyright 2021 Storied.com. All rights reserved.</div>
    </div>
</div>:null
    
    
}

export default Footer;