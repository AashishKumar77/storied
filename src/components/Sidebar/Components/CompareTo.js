import React from 'react';
import ToggleButton from "../../ToggleButton"
const CompareTo = ({
    profile,
    setCompareTree,
    compareTree
}) => {
    const handleCompareTree = e => {
        if (e.target.checked) setCompareTree(true)
        else setCompareTree(false)
    }
    return <>
        <div className="">
            <div className={`bg-gray-600 py-2.5 px-3 rounded-lg bg-opacity-35`}>
                <div className="head">
                    <div className="flex justify-between items-center">
                        {
                            profile && profile.name ? <>
                                <div className="leading-3">
                                    <div className="text-gray-700 font-medium">
                                        <span className="text-white mb-0 text-sm font-medium">
                                            {profile.name && profile.name.value && profile.name.value.firstName}
                                        </span>
                                        <span className="inline-block text-white mb-0 text-sm font-medium ml-1">
                                            {profile.name && profile.name.value && profile.name.value.lastName}
                                        </span>
                                    </div>
                                    <p className="font-light text-gray-300 mb-0"> in your tree</p>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-xs text-gray-300 mr-3">Compare</span>
                                    <ToggleButton enable={compareTree} onChange={(e) => handleCompareTree(e)} />
                                </div>
                            </> : <p className="text-white mb-0 text-sm py-2"> Compare to...</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    </>
}


export default CompareTo;