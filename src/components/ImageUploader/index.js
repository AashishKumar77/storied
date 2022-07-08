import React, { useState } from "react";
import { FileDrop } from "react-file-drop";
import "./index.css";
import Translator from "../Translator";
// Components
import Icon from "../Icon";

const defaultClasses = {
  root: "upload-img",
  upload: "file-drop"
}  
const ImageUploader = ({ 
  selectShowImage, 
  selectedFile, 
  setSelectedFile, 
  onTargetClick, 
  fileInputRef, 
  imageLoading,
  children, 
  setCropState,
  className=defaultClasses}) => {
  const _className = Object.assign(defaultClasses, className)
  const [iconColor, setIconColor] = useState("default");
  
  // Select/Drag/Drop Image
  const handleChange = (event) => {
    handleFile(event.target.files);
  };

  const handleDrop = (files) => {
    handleFile(files);
  };

  const handleFile = (files) => {
    if (files[0] && files[0].name !== undefined) {
      const file = files[0];
      setCropState && setCropState('create');
      setSelectedFile({
        ...selectedFile,
        file: file });
      selectShowImage && selectShowImage();
    }
  }

  const handleMouseOver = () => {
    setIconColor("primary"); 
  }

  const handleMouseLeave = () => {
    setIconColor("default"); 
  }

  return (
    <div className={_className.root} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
    <input
      onChange={handleChange}
      ref={fileInputRef}
      type="file"
      accept="image/*"
      className="hidden"
    />

    <FileDrop className={_className.upload} onDrop={handleDrop} onTargetClick={onTargetClick}>
    {children?children:<><div className="add-photo-uploader">
        <div>
          <Icon type="addPhoto" size="large" color={iconColor}/>
        </div>
        <div className="addPhoto-txt">
          {( (selectedFile && selectedFile.file === null) || selectedFile === null) && !imageLoading && <Translator tkey="person.header.imgupload"/>}
          {imageLoading && "Loading..."}
        </div>
      </div>
    </>}
    </FileDrop>
  </div>
  );
};

export default ImageUploader;
