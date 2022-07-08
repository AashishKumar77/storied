import React from 'react';
import Typography from "./../../../../../components/Typography";
import Skeleton from './../../../../../components/Skeleton'

const Loader = () => <div className="rel-item flex w-full items-center">
    <div className="loading-rel-media rounded-md overflow-hidden  avtar-square-medium">
        <Skeleton variant={"rect"} width={"100%"} height={"100%"} />
    </div>
    <div className="loading-rel-info flex-grow">
        <Skeleton variant={"text"} width={"90%"} />
        <Skeleton variant={"text"} width={"36%"} />
    </div>
</div>

const Right = () => {
    return (<>
        <div className="rel-list-items mb-4">
            <h3 className="mb-3"><Typography size={12}>Parents</Typography></h3>
            <div className="mb-2">
                <Loader />
            </div>
            <div className="mb-2">
                <Loader />
            </div>
        </div>
        <div className="rel-list-items mb-4">
            <h3 className="mb-3"><Typography size={12}>Spouse</Typography></h3>
            <div className="mb-2">
                <Loader />
            </div>
            <div className="mb-2">
                <Loader />
            </div>
        </div>
        <div className="rel-list-items mb-4">
            <h3 className="mb-3"><Typography size={12}>Children</Typography></h3>
            <div className="mb-2">
                <Loader />

            </div>
            <div className="mb-2">
                <Loader />

            </div>
        </div>
    </>)
}

export default Right;