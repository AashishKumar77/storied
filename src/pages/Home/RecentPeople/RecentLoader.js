import Skeleton from "./../../../components/Skeleton";
const RecentLoader = () => {
    return <>
        <div className="recent-ppl-list content-loader-wrap mt-1">
            {[1, 2, 3].map((_, key) =>
                <div key={key} className="flex items-center mb-3.5 cursor-pointer">
                    <div className="media overflow-hidden mr-2 avtar-square-medium">
                        <Skeleton variant={"circular"} width={"100%"} height={"100%"} />
                    </div>
                    <div className="media-info flex-grow avtar-square-medium-name">
                        <div className="recent-user-info">
                            <p className="title mb-0.5 main-title">
                                <Skeleton variant="rectangular" width="51%" height={14} />
                            </p>
                            <p className="flex flex-wrap">
                                <Skeleton variant="rectangular" width="72%" height={14} />
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </>

}

export default RecentLoader;