import React from "react";
import Button from "./../Button";
import TailwindModal from "./../TailwindModal";

const TailwindModalDialog = ({
    showModal,
    setShowModal,
    handleAction,
    content
}) => {
    return <TailwindModal showModal={showModal}   
    innerClasses = "max-w-edit-search-modal-w modal-xs" 
    setShowModal = {setShowModal}
    title={'Are you sure?'}
    content={
        <><p>{content}</p>
        <div className="flex justify-end mt-10">
            <Button 
            size="large"
            type="default"
            handleClick={(e) => {
                e.preventDefault();
                setShowModal(false);
            }}
            title="Cancel"/>
      <div className="ml-2">
      <Button 
            handleClick={(e) => {
                e.preventDefault();
                handleAction();
            }}
            size="large"
            type="danger"
            title="Delete"/>
      </div>
            </div>
        </>
    }
    />
}
export default TailwindModalDialog