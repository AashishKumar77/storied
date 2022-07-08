import React from 'react';
import TreeButton from './TreeButton'
const SideBardCloseButton = ({
  showSideBarAction,
  savedPerson,
  treeData,
  showSideBar,
  saveButton,
  showStoryDropdown,
  setShowStoryDropdown
}) => {
  return <>
    {!showSideBar && saveButton ? <div className="fixed m-left-2 mt-28 w-full flex justify-end">
      <div className="flex mr-8">

        <div className="dd-button ml-2">
          <div className="relative inline-block text-left ">
            <TreeButton
              text={'Save'}
              hidePanel={true}
              savedPerson={savedPerson}
              treeData={treeData}
              setShowStoryDropdown={setShowStoryDropdown}
              showStoryDropdown={showStoryDropdown}
            />
          </div>
        </div>
        <button className='ml-2' onClick={() => showSideBarAction()}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 8C32 3.58172 28.4183 0 24 0L8 0C3.58172 0 0 3.58172 0 8V24C0 28.4183 3.58172 32 8 32H24C28.4183 32 32 28.4183 32 24V8Z" fill="#555658" />
            <path d="M8.5 15.999H15.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 18.499L8.5 15.999L11 13.499" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M23.5 8.49902H18.5V23.499H23.5V8.49902Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

        </button>
      </div>
    </div> : null}
  </>
}
export default SideBardCloseButton;