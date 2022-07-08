import Typography from "./../../../../components/Typography";
import {
    useLocation
} from "react-router-dom";
import { tr } from "./../../../../components/utils";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
    decodeDataToURL, getKeywordsArr, months
} from "../../../../utils";


const callingName = (values) => {
    let name = []
    if (values.fn) {
        name.push(values.fn)
    }
    if (values.ln) {
        name.push(values.ln) 
    }
    return name.join(' ');
}

const getMonths = (month) => {
    let val = month > 9 ? month :"0" + month
    let monthname = [];
    for (const [key, value] of Object.entries(months)) {
        if (val === value) {
            monthname.push(key)
        }
    }
    return monthname.join(' ')
    
}
const combinelocation = (city, states, country, publication) => {
    let locationname = []
    if (city) {
        locationname.push(city.name)
    }
    if (states ) {
        locationname.push(states.name)
    }
    if (country) {
        let vale = country.name === "United States Of America" ? "USA" : country.name
        locationname.push(vale)
    }
    if (publication) {
        locationname.push(publication.name)
    }
    return locationname.join(', ');
}

const beforeyear = (values) => {
    let year = []
    if (values.be.y) {
        year.push("1 Jan " +values.be.y)
    }
    return year.join(' ')
}
const afteryear = (values) => {
    let year = []
    if (values.af.y) {
        year.push("31 Dec "+ values.af.y)
    }
    return year.join(' ')
}

const combineyear = (values) => {
    let year = []
    if (values.ye.y) {
        year.push(values.ye.y)
    }
    if (values.ye.eb) {
        year.push(<span className='text-gray-500'>{" ±" + values.ye.eb + " years"}</span>)
    }

    return year
}
const betweenDate = (values) => {
    let betweenOne = []
    let betweenTwo =[]
    if (values.bt.d) {
        betweenOne.push(values.bt.d)
    }
    if (values.bt.m) {
        betweenOne.push(getMonths(values.bt.m))
    }
    if (values.bt.y) {
        betweenOne.push(values.bt.y)
    }
    if (values.bt.ed) {
        betweenTwo.push(values.bt.ed)
    }
    if (values.bt.em) {
        betweenTwo.push(getMonths(values.bt.em))
    }
    if (values.bt.ey) {
        betweenTwo.push(values.bt.ey)
    }
    return betweenOne.join(" ") + "-" + betweenTwo.join(" ");
}
const filterTheData = (values, locationData) => {
   
    let country = values.cu && locationData.counties.find(x => x.id == values.cu)
    let states = values.st && locationData.states.find(x => x.id == values.st);
    let city = values.ci && locationData.city.find(x => x.id == values.ci);
    let publication = values.pu && locationData.publication.find(x => x.id == values.pu);
    return {country,states,city,publication}
}


const exactDate = (values) => {
    // values?.ex?.d + " " + getMonths(values?.ex?.m) + " " + values?.ex?.y
    let exactData  = []
    if (values.ex.d) {
        exactData.push(values.ex.d)
    }
    if (values.ex.m) {
        exactData.push(getMonths(values.ex.m))
    }
    if (values.ex.y) {
        exactData.push(values.ex.y)
    }
    return exactData.join(' ')
}
const NewsPaperSearch = ({ handleModal }) => {

    const { t } = useTranslation();
    const getKeywordsArray = getKeywordsArr(tr, t);
    let locationData = useSelector((state) => {return  state.location })
    const location = useLocation();
    let values = decodeDataToURL(location.search)
    const name = callingName(values)
    let { country, states, city, publication } = filterTheData(values, locationData)
        return (<div className="uni-refine-search-sidebar mb-8 mt-3 pt-6 hidden lg:block">
            <div className="bg-white border border-gray-200 sm:rounded-xl sm:shadow-sm p-3 mt-6 md:py-5 md:px-6">
                <div className="head">
                    <h2 className="mb-3">
                        <Typography size={16} text="secondary" weight="medium">
                            Refine Search
								</Typography>
                    </h2>
                </div>
                <div className="flex flex-wrap mb-5">
                    {name && <div className="refine-row w-full border-b border-gray-200 pb-2.5 pt-2.5">
                        <div className="label-wrap">
                            <label className="block text-blue-400 text-xs typo-font-medium mb-2.5">
                                Name
							</label>
                            <div className="text text-sm">{name}</div>
                        </div>
                    </div>}
                    {values.k && values.k.length > 0 &&
                        <div className="refine-row w-full border-b border-gray-200 pb-2.5 pt-2.5">
                            <div className="label-wrap">
                                <label className="block text-blue-400 text-xs typo-font-medium mb-2.5">
                                    Keywords
									</label>
                                 {values.k.map(x => (
                                    <>
                                            <div className="text text-sm mb-2">
                                        <span className='text-gray-500'>{getKeywordsArray[x.m]}:</span><span> {x.t}</span>
                                            </div>
                                    </>
                                ))}
                            </div>
                        </div>
                    }
                    
                    
                    {values.cu && 
                        <div className="refine-row w-full border-b border-gray-200 pb-2.5 pt-2.5">
                            <div className="label-wrap">
                                <label className="block text-blue-400 text-xs typo-font-medium mb-2.5">
                                    Location
									</label>
                                <div className="text text-sm pr-3">
                                {combinelocation(city, states, country, publication)}
                            </div>
                        </div>
                        </div>
                    }
                    { values.nm && 
                    <div className="refine-row w-full border-b border-gray-200 pb-2.5 pt-2.5">
                        <div className="label-wrap">
                            <label className="block text-blue-400 text-xs typo-font-medium mb-2.5">
                                Date
									</label>
                            {values.nm === "byyear" &&
                                <div className="text text-sm pr-3"><span className='text-gray-500 mr-1'>Year:</span>{ combineyear(values)}</div>
                            }
                            {values.nm === "before" &&
                                <div className="text text-sm pr-3"><span className='text-gray-500 mr-1'>Before:</span> {beforeyear(values)}</div>
                            }
                            {values.nm === "between" && 
                                <div className="text text-sm pr-3"><span className='text-gray-500 mr-1'>Between:</span>{betweenDate(values)}</div>
                            }
                            {values.nm === "exact" &&
                                <div className="text text-sm pr-3"><span className='text-gray-500 mr-1'>Exact:</span> {exactDate(values)}</div>
                            }
                            {values.nm === "after" &&
                                <div className="text text-sm pr-3"><span className='text-gray-500 mr-1' >After:</span> {afteryear(values)}</div>
                            }
                        </div>
                    </div>
                    }
                </div>
                <div className="flex justify-end w-full">
                    <button type="submit" className="btn btn-primary btn-medium" onClick={() => handleModal(true)}>Edit Search</button>
                </div>
            </div>
        </div>)
    // }
}

export default NewsPaperSearch