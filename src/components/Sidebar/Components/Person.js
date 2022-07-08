import Tooltip from './../../Tooltip/index'
import {
    personGetTextBold
  } from "../../utils/sidebar";
import className from "classnames"
const Person = ({
    Item,
    gotoRouter,
    compare
}) => {
    const tooltipConfig = {
        background: "#555658",
    };
    const compareIsNew = compare && Item.isNew;
    const tooltipCond=(compareCond,itemObj,defineVar)=>{
      return  compareCond && itemObj.restrict && itemObj.field.includes(`${defineVar}`) ?
         <Tooltip {...tooltipConfig} title={<p className="font-normal font-sans text-sm mb-0">
                    The information in the record and the information in your tree are different
                </p>}><span className="font-bold cursor-pointer">{defineVar}</span></Tooltip> : defineVar
    }
    if (Item.isNewCompare) {
        return <div className={className({"flex-grow flex": true, "mb-3": compare, "mb-0.5": !compare})}>
        </div>
    }
    let classBithInfo = "font-light text-gray-300";
    if (compare) {
        classBithInfo = Item.isNew ? "font-bold text-white" : "font-light text-white";
    }
       let firstName = <span className={className({"mr-1": true, "border-b-2 border-orange-400": personGetTextBold(compare , Item, 'firstName')})}>
                                                                {Item.firstName.toLowerCase()}
                                                                </span>,
        lastName = <span className={className({"inline-block": true, "border-b-2 border-orange-400": personGetTextBold(compare, Item,"lastName")})}>{Item.lastName.toLowerCase()}</span>,
        birthYear = <span className={className({"ml-0.5": true, "border-b-2 border-orange-400": personGetTextBold(compare, Item,"birthYear")})}>
             {Item.birthYear}
        </span>,
        district = <span className={className({"ml-2 inline-block": true, "border-b-2 border-orange-400": personGetTextBold(compare , Item,"district")})}>
            {Item.district.toLowerCase()}
        </span>;
     
    return <div className={className({"flex-grow flex": true, "mb-3": compare, "mb-0.5": !compare})}>
        <div className={className({
            "flex": true,
            "group cursor-pointer": gotoRouter
        })}  {...gotoRouter ? { onClick: gotoRouter.bind(null, Item) } : {}} >
            <div>
                <h3 className={className({"group-hover:opacity-80 inline-block text-white mb-0 text-sm": true,
                "relative -top-0.5": compare,
                "font-bold ": compareIsNew,
                "font-normal ": !compareIsNew})}>
                    <span className={`mr-1`}>
                        {tooltipCond(compare,Item,firstName)}
                        {tooltipCond(compare,Item,lastName)}
                    </span>
                    {Item.age && !compare ? <span className="mr-1 font-light text-gray-300 font-light text-sm">{Item.age}</span> : null}
                </h3>
                <p className={`group-hover:opacity-80 inline-block mb-0  ${classBithInfo}  text-sm`}>b.
                {tooltipCond(compare,Item,birthYear)}
                    
                    {compare && Item.restrict && Item.field.includes("district") ? <Tooltip {...tooltipConfig} title={<p className="font-normal font-sans
text-sm mb-0">
                        The information in the record and the information in your tree are different
            </p>}><span className="cursor-pointer">{district}</span></Tooltip> : <span>{district}</span>}
                    
                </p>
            </div>
            {compareIsNew ? <span className="mt-2 mb-auto py-0.5 ml-1 px-1 rounded-sm relative -top-0.5 bg-blue-400 font-bold text-xxxs">NEW</span> : null}
        </div>
        {/* Tooltip **/}
        {compare ? null :
            <div className="tooltip-wrap ml-1">
                <div className="items-center flex relative">
                    <div className="icon ml-1 group">
                        <Tooltip {...tooltipConfig} title={<p className="font-normal font-sans
text-sm mb-0">
                            Household members below this line are on the next page of the census.
            </p>} ><svg width="13" height="17" className="cursor-pointer" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g opacity="0.5">
                                    <path d="M1 16V1H6.63636L12 6.44681V16H1Z" fill="#FAFAFA" />
                                    <path d="M12 6.44681V16H1V1H6.63636M12 6.44681L6.63636 1M12 6.44681H6.63636V1" stroke="#9D9FA2" />
                                </g>
                            </svg></Tooltip>
                    </div>
                </div>
            </div>}

        {/* Tooltip **/}
    </div>
}
export default Person;