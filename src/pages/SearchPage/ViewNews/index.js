import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
    useHistory,
    useLocation,
    useParams
} from 'react-router-dom'
import { useTranslation } from "react-i18next"
import {
    handleIframeMessage,
} from "./../../../components/utils/sidebar";
import { tr } from "../../../components/utils";
import { getEmailDefaultValue } from "../../../utils/index"
import TailwindModal from "../../../components/TailwindModal";
import SendEmail from "../EmailSend/SendEmail";
const capitalFirst = (_name) => {
    return _name.charAt(0).toUpperCase() + _name.slice(1)
}
const shareUrl = "https://newspaperarchive.com/"
const ViewNews = props => {
    const location = useLocation();
    const { recordId } = useParams();
    const history = useHistory();
    const { t } = useTranslation();
    const iframeDiv = useRef(null)
    const defaultValues = getEmailDefaultValue();
    const [searchTerm, setSearchTerm] = useState(false);
    const title ='Email';
    const [startClipping, setStartClipping] = useState(false);
    const [openEmailModal, setOpenEmailModal] = useState(false);
    const setOpenShareModal = ()=>{
        return null
    };
    useEffect(() => {
        if (!recordId) {
            history.push('/')
        }
        if (location.search) {
            let spiltName = recordId.split('-')
            const dateSting = spiltName.splice(spiltName.length - 5, 5);
            spiltName = spiltName.map((_name)=>{
                return capitalFirst(_name)
            })
            const _title = `${spiltName.join(" ")} Newspaper Archives, ${capitalFirst(dateSting[0])} ${dateSting[1]}, ${dateSting[2]} p. ${dateSting[4]}`
            document.head.querySelector('meta[property="og:title"]').setAttribute("content", _title);
            document.head.querySelector('meta[property="og:description"]').setAttribute("content", `Read ${_title} with family history and genealogy records from `);
            document.head.querySelector('meta[property="og:url"]').setAttribute("content", window.location.href);
            let str = location.search
           
            if (str[0] === "?") str = str.substring(1);
            var queryParam = str.split('&');
            var _searchTerm = queryParam.map((_param) => {
                const value = _param.split('=')
                if (["fn", "ln", "kd[0].t", "kd[1].t", "kd[2].t", "kd[3].t", "kd[4].t"].includes(value[0])) {
                    return value[1]
                }
                if(value[0] === "imgId") {
                    document.head.querySelector('meta[property="og:url"]').setAttribute("content", value[1])
                }
                return false;
            }).filter((_param) => _param).join(" ")
            setSearchTerm(_searchTerm)
        }
    }, [history, recordId, location.search])
    const setHideIframeFun = () => {
        history.push(`/stories/add/newspaper/${recordId}${location.search}`)
    }
    const hanlde = () => {
        setOpenEmailModal(false)
    }
    useEffect(() => {
        const handleIframeMessageEvent = (e) => {
            handleIframeMessage(e)(setOpenEmailModal, setOpenShareModal, setHideIframeFun, setStartClipping, `${shareUrl}${recordId}`);
        }
        window.addEventListener('message', handleIframeMessageEvent)
        return () => window.removeEventListener('message', handleIframeMessageEvent)
    }, [])
    const handleSubmit = () => {
        setOpenEmailModal(false)
    }
    let array = new Uint8Array(1), 
        crypt = window.crypto.getRandomValues(array);
    const iframe = useMemo(() => {
        return <iframe key={crypt} src={`https://imgwrapper.storied.com/${recordId}${searchTerm ? "?searchterm=" + searchTerm : ""}`} height={"100%"} width={"100%"} title="Iframe Image"></iframe>
    }, [recordId, searchTerm])
    return <>
        <div ref={iframeDiv} className={`w-full transform transition scale-auto`}>
            <div className={`h-screen transition-all duration-500`}>
                <div className="pt-16 w-full h-screen">
                    <div className="SuccessAlert hidden absolute md:bottom-6 bottom-5 left-6">
                        <div className="bg-green-600 inline-flex items-center text-white px-4 py-3.5 border-0 rounded relative">
                            <span className="text-xl inline-block mr-3 align-middle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
                                    <path d="M5.96143 10.8462L8.72104 13.0539C8.79516 13.1149 8.88194 13.1586 8.97508 13.1819C9.06823 13.2052 9.16539 13.2074 9.2595 13.1885C9.35452 13.1706 9.44458 13.1326 9.52356 13.0768C9.60254 13.0211 9.66858 12.949 9.7172 12.8654L14.0384 5.46155" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M10 18.25C14.8325 18.25 18.75 14.3325 18.75 9.5C18.75 4.66751 14.8325 0.75 10 0.75C5.16751 0.75 1.25 4.66751 1.25 9.5C1.25 14.3325 5.16751 18.25 10 18.25Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </span>
                            <span className="inline-block text-sm typo-font-medium align-middle mr-6">
                                Story successfully created!
                            </span>
                            <button className="bg-transparent text-sm typo-font-medium text-green-100 outline-none focus:outline-none hover:text-white focus:text-white" >
                                <span>View</span>
                            </button>
                        </div>
                    </div>
                    {iframe}
                </div>
            </div>
        </div>
        {startClipping && <div class="bg-black inline-flex items-center text-white h-16 w-full absolute top-0 left-0 px-4 opacity-30 z-500"></div>}
        <TailwindModal
            title={title}
            showClose={true}
            innerClasses={"max-w-src-modal-w"}
            titleFontWeight={"typo-font-medium"}
            modalWrap={"md:p-10 p-6"}
            modalHead={"pb-3.5"}
            modalPadding={"p-0"}
            content={
                <SendEmail
                    defaultValues={defaultValues}
                    WWIIIClear={true}
                    buttonTitle={tr(t, "Send")}
                    handleNewspapperSubmit={handleSubmit}
                    clearfun={hanlde}
                />
            }
            showModal={openEmailModal}
            setShowModal={setOpenEmailModal}
        />
       
    </>
}

export default ViewNews;