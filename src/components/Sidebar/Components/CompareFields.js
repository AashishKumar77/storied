import React from 'react';
import RelationField from './RelationFields';
import Tooltip from './../../Tooltip';
import {
    getFirstIndexClass
} from "../../utils/sidebar";
import className from "classnames";
const CompareFields = ({
    index,
    field,
    label,
    compareField
}) => {
    const tooltipConfig = {
        background: "#555658",
    };
    const checkRestrict = (data) => {
        let html = null;
        let restrict = false;
        let isNew = false;
        const checkRestrictOrNew = (key, valueCondidion) => {
            if (data.restrict 
                && data.field.includes(key)) {
                restrict = true;
            } else if (data.isNew 
                && data.newField.includes(key) 
                && valueCondidion) {
                isNew = true;
            }
        }
        if (data.value instanceof Object 
            && typeof data.value == 'object') {
            html = Object.keys(data.value).map((key, indexKey) => {
                restrict = false;
                checkRestrictOrNew(key, data.value[key] !== "");
                let outData = <span key={key} className={
                    className({
                        "inline-block": true,
                        "border-b-2 border-orange-400 font-bold": restrict,
                        "font-normal": !restrict,
                        "ml-1": getFirstIndexClass(indexKey)
                    })}>
                    {data.value[key].toLowerCase()}
                </span>
                return restrict ? <Tooltip key={key} {...tooltipConfig} title={<p className="font-normal font-sans
                text-sm mb-0">
                    The information in the record and the information in your tree are different
            </p>} ><span className="cursor-pointer">{outData}</span></Tooltip> : outData;
            })
        } else {
            checkRestrictOrNew(index, data.value !== "");
            html = <span className={className({
                "border-b-2 border-orange-400 font-bold": restrict,
                "font-normal": !restrict})}>{data.value}</span>
            html = restrict ? <Tooltip {...tooltipConfig} title={<p className="font-normal font-sans
             text-sm mb-0">
                The information in the record and the information in your tree are different
        </p>} ><span className="cursor-pointer">{html}</span></Tooltip> : html;
        }
        return {
            restrict,
            html,
            isNew
        }
    }
    const getFieldHtml = (data) => {
        let fieldHtml = null;
        if (Array.isArray(data)) {
            fieldHtml = <RelationField data={data} compare={true} />
        } else {
            var {
                restrict,
                isNew,
                html
            } = checkRestrict(data);
            fieldHtml = <><h3 className="text-white mb-0 text-sm font-medium">
                {html}
                <span className="font-light text-white ml-1">{field.lightValue}</span>
                {isNew ? <span className="py-0.5 px-1 rounded-sm relative -top-0.5 bg-blue-400 font-medium text-xxxs ml-2">NEW</span> : null}
            </h3>
                {restrict ? <span className="ml-1 hidden">
                    <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.63398 0.499999C6.01888 -0.166667 6.98113 -0.166667 7.36603 0.5L12.1292 8.75C12.5141 9.41667 12.0329 10.25 11.2631 10.25H1.73686C0.967059 10.25 0.485935 9.41667 0.870835 8.75L5.63398 0.499999Z" fill="#F2B053" />
                        <path d="M7.31362 6.95305H5.94553L5.73004 1.9668H7.5291L7.31362 6.95305ZM5.67993 8.50655C5.67993 8.25933 5.76846 8.05721 5.94553 7.90018C6.12594 7.73982 6.34978 7.65964 6.61705 7.65964C6.88432 7.65964 7.10648 7.73982 7.28355 7.90018C7.46396 8.05721 7.55416 8.25933 7.55416 8.50655C7.55416 8.75378 7.46396 8.95757 7.28355 9.11793C7.10648 9.27495 6.88432 9.35346 6.61705 9.35346C6.34978 9.35346 6.12594 9.27495 5.94553 9.11793C5.76846 8.95757 5.67993 8.75378 5.67993 8.50655Z" fill="#5D4212" />
                    </svg>
                </span> : null}
            </>
        }
        return fieldHtml;
    }
    const getHtml = () => {
        if (Array.isArray(field)) {
            return <><div className="grid grid-cols-2 border-t border-gray-600">
                <div className="border-r border-gray-600 py-1.5 pl-4 pr-2">
                    <h2 className="mb-0.5 text-xs text-gray-300 font-normal">{label}</h2>
                </div>
                <div className="py-2 px-3">
                    <h2 className="mb-0.5 text-xs text-gray-300 font-normal">{label}</h2>
                </div>
            </div>
                <RelationField data={field} compare={true} />
            </>
        }
        return <div className="grid grid-cols-2 border-t border-gray-600">
            <div className="border-r border-gray-600 py-1.5 pl-4 pr-2">
                <h2 className="mb-0.5 text-xs text-gray-300 font-normal">{label}</h2>
                {field && getFieldHtml(field)}
            </div>
            <div className="py-2 px-3">
                <h2 className="mb-0.5 text-xs text-gray-300 font-normal">{label}</h2>
                {compareField && getFieldHtml(compareField)}
            </div>
        </div>
    }
    return getHtml()
}

export default CompareFields