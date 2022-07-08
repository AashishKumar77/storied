import Skeleton from "./../../../components/Skeleton";
import PersonHeaderLoader from "./PersonHeaderLoader";
const ProfileLoader = ({width}) => {
    return <>
       {width>512 && <PersonHeaderLoader/>} 
        <div className="card-content px-6 pt-3 content-loader-wrap">
            <div className="flex justify-between mb-7 pb-0.5">
                <p className="w-3/5">
                    <Skeleton variant="rectangular" width="100%" height={14} />
                </p>
                <p className="whitespace-nowrap w-1/5">
                    <Skeleton variant="rectangular" width="100%" height={14} />
                </p>
            </div>
            <div className="flex justify-between mb-7 pb-0.5">
                <p className="w-3/5">
                    <Skeleton variant="rectangular" width="100%" height={14} />
                </p>
                <p className="whitespace-nowrap w-1/5">
                    <Skeleton variant="rectangular" width="100%" height={14} />
                </p>
            </div>
            <div className="flex justify-between mb-3">
                <p className="w-3/5">
                    <Skeleton variant="rectangular" width="100%" height={14} />
                </p>
                <p className="whitespace-nowrap w-1/5">
                    <Skeleton variant="rectangular" width="100%" height={14} />
                </p>
            </div>
        </div>
    </>

}

export default ProfileLoader;