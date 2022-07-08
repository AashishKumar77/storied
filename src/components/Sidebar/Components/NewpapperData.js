import React from 'react';
const NewpapperData = ({ profile }) => {
    return <>
        <div className="scrollable-content records pt-4 pb-2 px-4 sm:px-3.5">
            <div className="mb-1">
                <div className="flex items-start">
                    <div>
                        <h3 className="text-white mb-0 text-base font-normal">
                            {profile.dateTime}
                        </h3>
                    </div>
                </div>
                <div className="flex items-start">
                    <div>
                        <h3 className="text-white mb-0 text-base font-normal">
                            {profile.address}
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    </>
}
export default NewpapperData;