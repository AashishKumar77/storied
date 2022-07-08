import React from 'react';

//Components
import ImageUploader from "../../components/ImageUploader";
import ImagePopper from '../../components/ImagePopper';

const Uploader = ({
    imgSrc,
    saveImageFile,
    setSelectedFile,
    selectedFile,
    onTargetClick,
    fileInputRef,
    imageLoading,
    photoMenu,
    handleSelect,
    selectShowImage,
    setCropState,
    from
}) => {
    const defaultClasses = {
        root: "upload-img",
        upload: "file-drop"
    }
    return (
        <>
            {imgSrc ?
                (
                    <div className="cursor-pointer z-10">
                        <ImagePopper
                            type="image"
                            imgSrc={imgSrc}
                            menu={photoMenu}
                            handleMenu={handleSelect}
                        />
                    </div>
                )
                :
                (
                    <ImageUploader
                        saveImageFile={saveImageFile}
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                        onTargetClick={onTargetClick}
                        fileInputRef={fileInputRef}
                        imageLoading={imageLoading}
                        selectShowImage={selectShowImage}
                        className={defaultClasses}
                        setCropState={setCropState}
                    />
                )
            }
        </>

    );
}

export default Uploader;