import React, { useEffect } from 'react';
import "./index.css";
const TreeButton = ({
  text,
  savedPerson,
  hidePanel,
  treeData,
  scrollDiv,
  treeDiv,
  screenDropDown,
  showStoryDropdown,
  setShowStoryDropdown
}) => {
  useEffect(() => {
    if (scrollDiv 
      && scrollDiv.current 
      && showStoryDropdown) {
        scrollDiv.current.scrollTop = scrollDiv.current.scrollHeight - scrollDiv.current.clientHeight;
    }
  }, [scrollDiv, showStoryDropdown])
  return <>
    <div className='ml-auto' ref={treeDiv}>
      <div>
        {hidePanel ? <button type="button" onClick={() => setShowStoryDropdown(!showStoryDropdown)} className="inline-flex justify-center w-full rounded-lg px-5 pt-1.5 py-2 bg-white text-base font-medium text-white bg-blue-400 hover:bg-blue-500" id="save-to-tree-menu" aria-haspopup="true" aria-expanded="true">
          {text}
          {/* <svg className="relative top-2.5 ml-1.5" width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.46387 0.999861L6.24958 6.35936C6.28064 6.39419 6.31752 6.42183 6.35812 6.44068C6.39872 6.45953 6.44224 6.46924 6.48619 6.46924C6.53014 6.46924 6.57366 6.45953 6.61426 6.44068C6.65486 6.42183 6.69174 6.39419 6.7228 6.35936L11.5085 0.999861" stroke="#D7D8D9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg> */}
        </button> : <div className="flex"><button type="button" onClick={() => setShowStoryDropdown(!showStoryDropdown)} className="inline-flex justify-center w-full rounded-lg bg-white text-sm typo-font-medium text-white bg-blue-400 hover:bg-blue-500 rounded-lg px-10 py-3 save-mt" id="save-to-tree-menu" aria-haspopup="true" aria-expanded="true">
          {text}
        </button>
            {/*<button onClick={() => setShowStoryDropdown(!showStoryDropdown)} className="bg-blue-400 hover:bg-blue-500 rounded-r-lg">
              <svg className=" border-l  border-gray-700 top-0 h-full  px-2 w-10 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>*/}
          </div>
        }
      </div>
    </div>
  </>
}

export default TreeButton;