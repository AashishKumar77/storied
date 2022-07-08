import Skeleton from "../../components/Skeleton"
const TellAStoryLoader = () => {
    return <>
        <div className="bg-white card w-full content-loader-wrap">
            <div className="card-content-wrap">
                <div className="py-4 px-6">
                    <div className="flex items-center">
                        <div className="mr-4 card-avatar rounded-full overflow-hidden w-10 h-10 flex items-center justify-center">
                            <Skeleton variant="circular" width={40} height={40} />
                        </div>
                        <div className="flex-grow">
                            <div className="tell-story-button">
                                <span className="btn btn-default btn-large pointer-events-none"><div className="flex justify-center items-center"><span>Tell a story...</span></div></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}
export default TellAStoryLoader