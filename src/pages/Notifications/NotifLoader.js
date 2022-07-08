import Skeleton from "./../../components/Skeleton";

const NotifLoader = () => {
  return (
    <>
      <div className="flex w-full content-loader-wrap pt-4 pb-6 px-4 sm:px-6 bg-white">
        <div className="nu-icon mr-4">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Skeleton variant="circular" width={40} height={40} />
          </div>
        </div>
        <div className="notification-info w-full">
          <div className="mb-2 relative inline-flex pr-26">
            <p className="ol-text">
              <Skeleton variant="rectangular" width={150} height={14} />
            </p>
            <p className="absolute right-0"></p>
          </div>
          <div className="flex mb-0.5">
            <div className="mb-2 flex-grow">
              <h3 className="max-two-lines mt-3">
                <Skeleton variant="rectangular" width="80%" height={14} />
              </h3>
              <p className="max-two-lines mt-2.5">
                <Skeleton variant="rectangular" width="100%" height={14} />
              </p>
              <p className="max-two-lines mt-2.5">
                <Skeleton variant="rectangular" width="100%" height={14} />
              </p>
            </div>
            <div className="overflow-hidden ml-6 mt-2.5 nu-img-r flex items-center justify-center">
              <Skeleton variant="rectangular" width={64} height={64} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotifLoader;
