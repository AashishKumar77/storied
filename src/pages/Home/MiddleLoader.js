import Skeleton from "./../../components/Skeleton";
import Typography from "./../../components/Typography";
import TellAStoryLoader from "./TellAStoryLoader";
import "./index.css";
const MiddleLoader = ({ width, isStory = false }) => {
    return <>
        <div className={`middle-cards-section flex flex-col flex-grow ${isStory ? 'card-padding' : ''}`}>
            <div className="w-full">
                {width > 512 && <TellAStoryLoader />}
                <div className={`bg-white card w-full content-loader-wrap ${isStory ? 'card-mb-0' : ''}`}>
                    <div className="card-content-wrap">
                        <div className="story-author-info py-4 px-6">
                            <div className="inline-flex items-center">
                                <div className="mr-2 card-avatar rounded-md overflow-hidden w-10 h-10 flex items-center justify-center avtar-square-large">
                                    <Skeleton variant="circular" width={40} height={40} />
                                </div>
                                <div className="flex-grow avtar-square-large-name">
                                    <div className="mb-1 main-title">
                                        <Skeleton variant="rectangular" width={127} height={14} />
                                    </div>
                                    <div className="mt-1">
                                        <Skeleton variant="rectangular" width={62} height={14} />
                                    </div>

                                </div>
                            </div>
                            <div className="story-card-persons-top mt-2">
                                <div className="tags break-words">
                                    <Skeleton variant="rectangular" width={296} height={14} />
                                </div>
                            </div>
                        </div>
                        <div className="story-media bg-gray-300 ">
                            <div className="w-full flex justify-center sth-image">
                                <Skeleton variant="rectangular" width="100%" height={427} />
                            </div>
                        </div>
                        <div className="story-detail-wrap pt-4 pb-8 px-6">
                            <div className="story-detail-container mb-5">
                                <div className="title mb-2">
                                    <Skeleton variant="rectangular" width={323} height={21} />
                                </div>
                                <div className="location-date mb-5">
                                    <Skeleton variant="rectangular" width={128} height={14} />
                                </div>
                                <div className="description mb-2">
                                    <div className="mb-2"><Skeleton variant="rectangular" width="100%" height={14} /></div>
                                    <div className="mb-2"><Skeleton variant="rectangular" width="100%" height={14} /></div>
                                    <div className="mb-2"><Skeleton variant="rectangular" width="96%" height={14} /></div>
                                </div>
                            </div>
                            <div className="story-action-buttons flex justify-between overflow-x-auto">
                                <button className="flex sm:flex-1 justify-center items-center rounded-md h-8 pointer-events-none px-3" onClick={e => e.stopPropagation()}>
                                    <span className="icon mr-2 mt-0.5">
                                        <svg width="12" height="17" viewBox="0 0 12 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.5 6H10.5C10.7652 6 11.0196 6.10536 11.2071 6.29289C11.3946 6.48043 11.5 6.73478 11.5 7V15C11.5 15.2652 11.3946 15.5196 11.2071 15.7071C11.0196 15.8946 10.7652 16 10.5 16H1.5C1.23478 16 0.980429 15.8946 0.792893 15.7071C0.605357 15.5196 0.5 15.2652 0.5 15V7C0.5 6.73478 0.605357 6.48043 0.792893 6.29289C0.980429 6.10536 1.23478 6 1.5 6H2.5" stroke="#747578" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M6 1V8" stroke="#747578" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M3.5 3.5L6 1L8.5 3.5" stroke="#747578" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                    <Typography size={14} weight="medium"><span className="text block">Share</span></Typography>
                                </button>

                                <button className="flex sm:flex-1 justify-center items-center rounded-md h-8 pointer-events-none px-3" onClick={e => e.stopPropagation()}>
                                    <span className="icon mr-2 mt-0.5">
                                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.5 1.00001C7.25253 0.998212 6.02731 1.33029 4.95149 1.96177C3.87566 2.59326 2.98843 3.50115 2.38186 4.59122C1.7753 5.68129 1.47151 6.91383 1.50201 8.16092C1.53251 9.40802 1.8962 10.6242 2.55533 11.6833L0.5 16L4.816 13.9447C5.73647 14.517 6.77726 14.8677 7.85637 14.9692C8.93548 15.0707 10.0234 14.9203 11.0345 14.5297C12.0455 14.1392 12.9521 13.5191 13.6827 12.7185C14.4133 11.9179 14.948 10.9586 15.2447 9.91609C15.5414 8.87361 15.5919 7.77648 15.3924 6.71113C15.1928 5.64579 14.7486 4.64134 14.0947 3.77693C13.4408 2.91253 12.5951 2.21177 11.6242 1.72988C10.6534 1.248 9.58387 0.998144 8.5 1.00001V1.00001Z" stroke="#747578" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                    <Typography size={14} weight="medium"><span className="text block">Comment</span></Typography>
                                </button>
                                <button className="flex sm:flex-1 justify-center items-center rounded-md h-8 pointer-events-none px-3" onClick={e => e.stopPropagation()}>
                                    <span className="icon mr-2 mt-0.5">
                                        <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.00006 14.0627L1.60806 7.39606C1.04629 6.83472 0.675505 6.11076 0.548304 5.32686C0.421104 4.54295 0.543942 3.7389 0.899397 3.02873V3.02873C1.16743 2.49281 1.55898 2.02824 2.04176 1.67332C2.52455 1.31839 3.08476 1.08326 3.67623 0.987293C4.26771 0.891329 4.87353 0.937279 5.44376 1.12136C6.014 1.30544 6.53233 1.62237 6.95606 2.04606L8.00006 3.08939L9.04406 2.04606C9.46779 1.62237 9.98613 1.30544 10.5564 1.12136C11.1266 0.937279 11.7324 0.891329 12.3239 0.987293C12.9154 1.08326 13.4756 1.31839 13.9584 1.67332C14.4412 2.02824 14.8327 2.49281 15.1007 3.02873C15.4557 3.73862 15.5783 4.5422 15.4513 5.32566C15.3242 6.10912 14.9539 6.83275 14.3927 7.39406L8.00006 14.0627Z" stroke="#747578" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                    <Typography size={14} weight="medium"><span className="text block">Like </span></Typography>
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>

}

export default MiddleLoader;