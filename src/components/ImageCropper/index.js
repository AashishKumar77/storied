import React, { useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";

// Components
import TailWindModal from "../TailwindModal";
import Button from "../Button";
import Icon from "../Icon";
import Loader from "../Loader";
import "./index.css";

const ImageCropper = ({ selectedFile, closeCropModal, imageFile, setImageFile, imageLoading, cropState, profileState, setSelectedFile, handleSaveImages, setShowInvalidModal, imageFetching, showImageCropper, from, saveAccountThumbnail, selectedHeroFile, compState }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [portrait, setProtrait] = useState(false);
  const [minZoom, setMinZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(8);

  const setParameter = () => {
    setCrop({ x: 0, y: 0 });
    setProtrait(false);
    setMinZoom(1);
    setZoomLevel(1);
    setZoom(1);
  };
  useEffect(() => {
    const ext = ["jpg", "jpeg", "gif", "png"];
    if (selectedFile && selectedFile.file) {
      var sizeInMb = selectedFile.file.size / 1024;
      var sizeLimit = 1024 * 10; // if you want 10 MB
      let fileExt = selectedFile.file.type.split("/")[1];
      if (ext.includes(fileExt) && sizeInMb < sizeLimit) {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile.file);
        reader.addEventListener("load", () => {
          setImageFile(reader.result);
        });
      } else {
        setShowInvalidModal(true);
      }
    }
    return setParameter();
  }, [selectedFile, setImageFile, setShowInvalidModal, setSelectedFile]);
  useEffect(() => {
    const ext = ["jpg", "jpeg", "gif", "png"];
    if (selectedHeroFile && selectedHeroFile.file) {
      var sizeInMb = selectedHeroFile.file.size / 1024;
      var sizeLimit = 1024 * 10; // if you want 10 MB
      let fileExt = selectedHeroFile.file.type.split("/")[1];
      if (ext.includes(fileExt) && sizeInMb < sizeLimit) {
        const reader = new FileReader();
        reader.readAsDataURL(selectedHeroFile.file);
        reader.addEventListener("load", () => {
          setImageFile(reader.result);
        });
      } else {
        setShowInvalidModal(true);
      }
    }
    return setParameter();
  }, [selectedHeroFile, setImageFile, setShowInvalidModal]);

  const onCropComplete = (areaCropped, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleZoomIn = () => {
    let zoomIn;
    let zoomLvl = Math.round(zoom / minZoom);
    if (Number.isInteger(zoom) && zoom + minZoom <= maxZoom) {
      switch (true) {
        case zoom === zoom * minZoom:
        case minZoom === zoom * minZoom:
        case zoom * minZoom < zoom:
          zoomIn = (zoom + 1) * minZoom;
          break;
        case zoom < zoomLevel * minZoom:
          zoomIn = zoomLevel * minZoom;
          break;
        default:
          zoomIn = (zoomLevel + 1) * minZoom;
          break;
      }
      let round = Math.round(zoomIn * 100) / 100;
      setZoom(round);
    } else if (zoom + minZoom <= maxZoom) {
      zoomIn = zoom + minZoom;
      let round = Math.round(zoomIn * 100) / 100;
      setZoom(round);
    } else {
      setZoom(maxZoom);
    }
    setZoomLevel(zoomLvl);
  };

  const handleZoomOut = () => {
    let zoomOut;
    let zoomLvl = Math.round(zoom / minZoom);
    if (zoomLevel >= 1) {
      setZoomLevel(zoomLvl);
    }
    if (Number.isInteger(zoom) && zoom - minZoom >= minZoom) {
      switch (true) {
        case zoom === zoom * minZoom:
        case minZoom === zoom * minZoom:
        case zoom * minZoom < zoom:
          zoomOut = (zoom - 1) * minZoom;
          break;
        case zoomLevel * minZoom < zoom:
          zoomOut = zoomLevel * minZoom;
          break;
        default:
          zoomOut = (zoomLevel - 1) * minZoom;
          break;
      }
      let round = Math.round(zoomOut * 100) / 100;
      setZoom(round);
    } else if (zoom - minZoom >= minZoom) {
      zoomOut = zoom - minZoom;
      let round = Math.round(zoomOut * 100) / 100;
      setZoom(round);
    } else {
      setZoom(minZoom);
    }
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
      image.src = url;
    });

  const getRadianAngle = (degreeValue) => {
    return (degreeValue * Math.PI) / 180;
  };

  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    // set each dimensions to double largest dimension to allow for a safe area for the
    // image to rotate in without being clipped by canvas context
    canvas.width = safeArea;
    canvas.height = safeArea;

    // translate canvas context to a central location on image to allow rotating around the center.
    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate(getRadianAngle(rotation));
    ctx.translate(-safeArea / 2, -safeArea / 2);

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // draw rotated image and store data.
    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

    // As Base64 string
    // return canvas.toDataURL("image/jpeg");
    return canvas;
  };

  const saveImage = async (imageSrc, imageCrop) => {
    let croppingInfo = {
      CropX: Math.round(croppedArea.x * 100) / 100,
      CropY: Math.round(croppedArea.y * 100) / 100,
      Height: croppedArea.height,
      Width: croppedArea.width,
      ZoomAspect: zoom,
    };
    if (!imageCrop || !imageSrc) {
      return;
    }
    const canvas = await getCroppedImg(imageSrc, imageCrop);
    canvas.toBlob(
      (blob) => {
        let fileUrl = canvas.toDataURL("image/jpeg", 0.9);
        const file = new File([blob], "test.png");
        handleSaveImages(file, croppingInfo, fileUrl);
      },
      "image/jpeg",
      0.3
    );
  };

  const uploadImage = () => {
    saveImage(imageFile, croppedArea);
  };

  const getInitialCroppedPixels = () => {
    if (cropState === "edit" || profileState === "edit") {
      if (selectedHeroFile) {
        return {
          width: selectedHeroFile.width,
          height: selectedHeroFile.height,
          x: selectedHeroFile.x,
          y: selectedHeroFile.y,
        };
      } else {
        return {
          width: selectedFile && selectedFile.width,
          height: selectedFile && selectedFile.height,
          x: selectedFile && selectedFile.x,
          y: selectedFile && selectedFile.y,
        };
      }
    }
    return croppedArea;
  };

  return (
    <>
      <TailWindModal
        showModal={showImageCropper}
        showClose
        innerClasses={!compState ? "profile-wrapper" : "hero-wrapper"}
        title="Crop Your Photo"
        content={
          <>
            {imageFile && <MyCropper imageFile={imageFile} crop={crop} setCrop={setCrop} zoom={zoom} setZoom={setZoom} handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} onCropComplete={onCropComplete} portrait={portrait} minZoom={minZoom} setProtrait={setProtrait} setMinZoom={setMinZoom} maxZoom={maxZoom} setMaxZoom={setMaxZoom} zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} cropState={cropState} selectedFile={selectedFile} profileState={profileState} compState={compState} selectedHeroFile={selectedHeroFile} getInitialCroppedPixels={getInitialCroppedPixels} handleSave={uploadImage} closeCropModal={closeCropModal} />}
            {imageFetching && !imageFile && <Loader />}
          </>
        }
        loading={imageLoading}
        setShowModal={closeCropModal}
      />
    </>
  );
};

export default ImageCropper;

const MyCropper = ({ imageFile, crop, setCrop, zoom, setZoom, maxZoom, setMaxZoom, selectedFile, setZoomLevel, profileState, handleZoomIn, handleZoomOut, onCropComplete, portrait, minZoom, setMinZoom, cropState, compState, selectedHeroFile, getInitialCroppedPixels, handleSave, closeCropModal }) => {
  return (
    <div className="crop-section">
      <div className="crop-container">
        <div className="left-landscape image-crop">
          <Cropper
            image={imageFile}
            crop={crop}
            zoom={zoom}
            aspect={!compState ? 1 : 2.5 / 1}
            minZoom={minZoom}
            maxZoom={maxZoom}
            zoomSpeed={minZoom}
            showGrid={false}
            cropSize={!compState ? { width: 220, height: 220 } : { width: 760, height: 300 }}
            initialCroppedAreaPixels={getInitialCroppedPixels()}
            onCropChange={setCrop}
            onZoomChange={(zoomValue) => {
              let round = Math.round(zoomValue * 100) / 100;
              setZoom(round);
            }}
            onCropComplete={onCropComplete}
            onMediaLoaded={(mediaSize) => {
              if (!compState) {
                // Adapt zoom based on media size to fit aspect
                if (mediaSize.width < mediaSize.height) {
                  let zoomValue = 220 / mediaSize.width;
                  let round = Math.round(zoomValue * 100) / 100;
                  let maxRound = round * 8; //8 times of min
                  if (cropState === "edit" || profileState === "edit") {
                    let roundEdit = Math.round(selectedFile.zoom * 100) / 100;
                    setZoom(roundEdit);
                  } else {
                    setZoom(round);
                  }
                  setMinZoom(round);
                  setMaxZoom(maxRound);
                } else {
                  let zoomValue = 220 / mediaSize.height;
                  let round = Math.round(zoomValue * 100) / 100;
                  let maxRound = round * 8; //8 times of min
                  if (cropState === "edit" || profileState === "edit") {
                    let roundEdit = Math.round(selectedFile.zoom * 100) / 100;
                    setZoom(roundEdit);
                  } else {
                    setZoom(round);
                  }
                  setMinZoom(round);
                  setMaxZoom(maxRound);
                }
              } else {
                if ((mediaSize.width < 300 && mediaSize.height < 300) || (mediaSize.width < 300 && mediaSize.height > 300) || (mediaSize.width >= mediaSize.height && mediaSize.width > 300 && mediaSize.height > 300)) {
                  let zoomValue = 760 / mediaSize.width;
                  let round = Math.round(zoomValue * 100) / 100;
                  let maxRound = round * 8; //8 times of min
                  if (cropState === "edit" || profileState === "edit") {
                    let roundEdit = Math.round(selectedHeroFile.zoom * 100) / 100;
                    setZoom(roundEdit);
                  } else {
                    setZoom(round);
                  }
                  setMinZoom(round);
                  setMaxZoom(maxRound);
                }
                if (mediaSize.width > 300 && mediaSize.height < 300) {
                  if (mediaSize.width > 760) {
                    let zoomValue = 300 / mediaSize.height;
                    let round = Math.round(zoomValue * 100) / 100;
                    let maxRound = round * 8; //8 times of min
                    if (cropState === "edit" || profileState === "edit") {
                      let roundEdit = Math.round(selectedHeroFile.zoom * 100) / 100;
                      setZoom(roundEdit);
                    } else {
                      setZoom(round);
                    }
                    setMinZoom(round);
                    setMaxZoom(maxRound);
                  } else {
                    let zoomValue = mediaSize.width > 350 ? 300 / mediaSize.height : 760 / mediaSize.width;
                    let round = Math.round(zoomValue * 100) / 100;
                    let maxRound = round * 8; //8 times of min
                    if (cropState === "edit" || profileState === "edit") {
                      let roundEdit = Math.round(selectedHeroFile.zoom * 100) / 100;
                      setZoom(roundEdit);
                    } else {
                      setZoom(round);
                    }
                    setMinZoom(round);
                    setMaxZoom(maxRound);
                  }
                }
              }
            }}
          />
        </div>
      </div>
      <div className="controls profile-control">
        <div className="zoom-control">
          <div className="mr-4">
            <Icon type="minus" size="small" color="secondary" background handleClick={handleZoomOut} disabled={zoom <= minZoom} />
          </div>
          <Slider
            value={zoom}
            min={minZoom}
            step={0.00000001}
            max={maxZoom}
            aria-labelledby="continuous-slider"
            onChange={(e, zoomVal) => {
              let round = Math.round(zoomVal / minZoom);
              setZoomLevel(round);
              setZoom(zoomVal);
            }}
            classes={{ root: "slider" }}
          />
          <div className="ml-4">
            <Icon type="plus" size="small" className="ml-3" background color="secondary" handleClick={handleZoomIn} disabled={zoom >= maxZoom} />
          </div>
        </div>
        <div className="flex justify-end w-full">
          <div className="mr-2">
            <Button
              type="default"
              size="large"
              tkey={"pedigree.dialog.form.btn.cancel"}
              handleClick={closeCropModal}
            />
          </div>
          <Button
            type="primary"
            size="large"
            tkey={"pedigree.dialog.form.btn.save"}
            handleClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
};
