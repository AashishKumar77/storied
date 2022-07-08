import React from 'react';
import Skeleton from './../../../../../components/Skeleton'
import {icons} from './../icons'
import Typography from "./../../../../../components/Typography";

const Left=()=>{
    return<>
    <button type="button"  className={`tw-list-item rounded-full btn flex  w-full is-active `}>
              <span className="icon w-8 mr-0.5 ml-1.5">
                {icons.Total}
              </span>
              <Typography weight="medium" text="danger" size={14}> All Stories</Typography>
            </button>
    <div className="pt-1.5">{[1,2,3,4,5,6,7,8].map((item)=>
    <div className="flex mb-4 pl-2.5 left-content-loader" key={item}>
    <Skeleton variant={"text"}  width={"11%"} />
    <Skeleton variant={"text"}  width={"57%"} />
    </div>) }</div></>
}

export default Left;