import Skeleton from "../../../components/Skeleton";

const PersonHeaderLoader =()=>{
    return <div className="head avatar-top px-6 border-b border-gray-200 py-4 mb-2 content-loader-wrap">
    <div className="flex items-center">
        <div className="mr-3.5 card-avatar rounded-full overflow-hidden w-10 h-10 flex items-center justify-center">
            <Skeleton variant="circular" width={40} height={40} />
        </div>
        <div className="flex-grow inside-span-block">
            <Skeleton variant="rectangular" width={113} height={14} />
        </div>
    </div>
</div>
}
export default PersonHeaderLoader;