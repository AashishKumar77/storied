import React, { useState, useEffect } from 'react';

const SaveToTree = ({treeFamily}) => {
  const [treeData, setTreeData] = useState("");
  useEffect(() => {
    let treeVal;
    if (Array.isArray(treeFamily)) {
     treeVal= treeFamily.map((item, i) =>{
     let family=', ';
        if( i === treeFamily.length - 2){
          family='and '
        }else if(i === treeFamily.length - 1){
          family=''
        } 
     return <><span className="font-medium">{item} </span>{family}</>
     });
    } else {
   treeVal= <span className="font-medium">{treeFamily}</span>
  }
  setTreeData(treeVal)
  }, [treeFamily])
  return <>
    <div className="flex w-full items-start px-4">
      <span className="mr-2 mt-1">
        <svg width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 9L10.5 16.5L22 2" stroke="#295DA1" strokeWidth="5" />
        </svg>
      </span>

      <p className="text-base font-light">
        Saved to {treeData} in your tree.
                  </p>
    </div>
  </>
}

export default SaveToTree