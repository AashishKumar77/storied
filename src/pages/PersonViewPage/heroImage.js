import React from 'react';

//Components
import HeroImageUploader from "../../components/HeroImageUploader";
import HeroImagePopover from '../../components/HeroImagePopover';

const HeroImage = ({
    imgSrc,
    saveImageFile,
    setSelectedHeroFile,
    selectedHeroFile,
    onTargetClick,
    heroImageRef,
    imageLoading,
    heroPhotoMenu,
    handleSelect,
    selectShowImage,
    setCropState,
    setMousePosition,
    ...props
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
                        <HeroImagePopover
                            type="image"
                            imgSrc={imgSrc}
                            menu={heroPhotoMenu}
                            handleMenu={handleSelect}
                            getMousePosition={props.getMousePosition}
                            mousePosition={props.mousePosition}
                            setCompState={props.setCompState}
                            setMousePosition={setMousePosition}
                        />
                    </div>
                )
                :
                (
                    <HeroImageUploader
                        saveImageFile={saveImageFile}
                        selectedHeroFile={selectedHeroFile}
                        setSelectedHeroFile={setSelectedHeroFile}
                        onTargetClick={onTargetClick}
                        heroImageRef={heroImageRef}
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

export default HeroImage;