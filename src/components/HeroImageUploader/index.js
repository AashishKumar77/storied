import React from "react";
import { FileDrop } from "react-file-drop";
// Components
import Icon from "../Icon";

const defaultClasses = {
    root: "upload-img",
    upload: "file-drop"
}
const HeroImageUploader = ({ 
    selectedHeroFile, 
    setSelectedHeroFile,
    heroImageRef,
    setCropState,
    className = defaultClasses }) => {
    const _className = Object.assign(defaultClasses, className)

    // Select/Drag/Drop Image
    const handleChange = (event) => {
        handleFile(event.target.files);
    };

    const handleDrop = (files) => {
        handleFile(files);
    };

    const handleFile = (files) => {
        if (files[0] && files[0].name !== undefined) {
            setCropState('create');
            const file = files[0];
            setSelectedHeroFile({
                ...selectedHeroFile,
                file: file
            });
        }
    }


    const onTargetClick = () => {
        heroImageRef.current.click();
    };

    return (
        <div className="hero-placeholder">
            <div className="upload-img">
                <input
                    onChange={handleChange}
                    ref={heroImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                />

                <FileDrop className={_className.upload} onDrop={handleDrop} onTargetClick={onTargetClick}>
                    <div className="hero-button">
                        <Icon
                            background
                            color="secondary"
                            id='"icon-" + crypt'
                            size="medium"
                            type="camera"
                        />
                    </div>
                </FileDrop>
            </div>
        </div>
    );
};

export default HeroImageUploader;
