import React from 'react';
const ProfileField = ({
    field,
    label
}) => {
    return <div className="flex items-start mb-1">
        <span className="font-light mt-text mb-0 w-20 text-xs text-gray-300 text-right pr-4">
            {label}
        </span>
        <div>
            <h3 className="text-white mb-0 text-sm font-normal">
                {
                    (field.value instanceof Object) ?
                        Object.keys(field.value).map((key, index) => {
                            return <span key={key} className={
                                `font-normal inline-block
                                ${index !== 0 ? "ml-1" : ""}`}>
                                {field.value[key].toLowerCase()}
                            </span>
                        })
                        : <span className={`font-normal`}>{field.value}</span>}
                {field && field.lightValue ?
                    <span className="font-light text-gray-300 pl-1">
                        {field.lightValue}
                    </span> : null}

            </h3>
        </div>
    </div>
}

export default ProfileField