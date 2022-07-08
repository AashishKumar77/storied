import React, { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";
import Button from "../Button";
import TailwindModal from "../../components/TailwindModal";
import Icon from "../Icon";
import { getWindowWidth, getScreen, getImageSize, dataURLtoFile } from "../../utils";

import "./index.css";
const getHeightSameRatio = (width, height, ratio) => {
  const widthImage = ratio;
  const heightImage = Math.round(height * (ratio / width) * 100) / 100;
  return {
    width: widthImage,
    height: heightImage,
  };
};
const getWidthSameRatio = (width, height, ratio) => {
  const heightImage = ratio;
  const widthImage = Math.round(width * (ratio / height) * 100) / 100;
  return {
    width: widthImage,
    height: heightImage,
  };
};
const getImageContainer = (selectedFile, cropSizeImage, layoutId, zoom) => {
  const horizantal = selectedFile.width > selectedFile.height;
  let { width: widthCalculate, height: heightCaluclate } = cropSizeImage;
  let imageWidth = selectedFile.width;
  let imageHeight = selectedFile.height;
  let windowWidth = 400;
  let windowHeight = 315;
  if (getWindowWidth() < 480) {
    const imgCal = getHeightSameRatio(windowWidth, windowHeight, getWindowWidth());
    windowWidth = imgCal.width;
    windowHeight = imgCal.height;
  }
  if (horizantal && imageWidth > windowWidth) {
    const imgCal = getHeightSameRatio(imageWidth, imageHeight, windowWidth);
    imageWidth = imgCal.width;
    imageHeight = imgCal.height;
  } else if (!horizantal && imageHeight > windowHeight) {
    const imgCal = getWidthSameRatio(imageWidth, imageHeight, windowHeight);
    imageWidth = imgCal.width;
    imageHeight = imgCal.height;
  }
  if (horizantal && imageHeight < heightCaluclate) {
    const imgCal = getWidthSameRatio(widthCalculate, heightCaluclate, imageHeight);
    widthCalculate = imgCal.width;
    heightCaluclate = imageHeight;
    cropSizeImage = {
      width: widthCalculate,
      height: heightCaluclate,
    };
  } else if (!horizantal && imageWidth < widthCalculate) {
    const imgCal = getHeightSameRatio(widthCalculate, heightCaluclate, imageWidth);
    widthCalculate = imageWidth;
    heightCaluclate = imgCal.height;
    cropSizeImage = {
      width: widthCalculate,
      height: heightCaluclate,
    };
  }
  if (widthCalculate > imageWidth) {
    const dif = widthCalculate - imageWidth;
    heightCaluclate = getHeightSameRatio(widthCalculate, heightCaluclate, imageWidth).height;
    widthCalculate = widthCalculate - dif;
    cropSizeImage = {
      width: widthCalculate,
      height: heightCaluclate,
    };
  } else if (heightCaluclate > imageHeight) {
    const dif = heightCaluclate - imageHeight;
    heightCaluclate = heightCaluclate - dif;
    widthCalculate = getWidthSameRatio(widthCalculate, heightCaluclate, imageHeight).width;
    cropSizeImage = {
      width: widthCalculate,
      height: heightCaluclate,
    };
  }
  return {
    containerCalculate: {
      width: widthCalculate,
      height: heightCaluclate,
    },
    imageCalculate: cropSizeImage,
  };
};
const getCropSize = (cropSize) => {
  const width = getWindowWidth();
  let mediaSize = width <= 479 ? cropSize.mobile : cropSize;
  if (mediaSize.width === "w-full") {
    mediaSize.width = width;
  }
  return mediaSize;
};
const CropperImage = ({ selectedFile, handleSaveImages, aspect, cropSize, setImageCropper, imageLayoutClass, layoutId }) => {
  const [crop, setCrop] = useState(selectedFile.selectedFile.crop);
  const [zoom, setZoom] = useState(selectedFile.selectedFile.zoomLevel);
  const minZoom = 1;
  const [grid, setGrid] = useState(getWindowWidth() <= 479);
  const [maxZoom, setMaxZoom] = useState(selectedFile.selectedFile.maxZoom);
  const [step, setStep] = useState(Math.round((maxZoom - 1) * 20) / 100);
  const [loading, setLoading] = useState(false);
  const [croppedArea, setCroppedArea] = useState(null);
  const [cropSizeImage, setCropSizeImage] = useState(getCropSize(cropSize));
  const handleResize = useCallback(() => {
    const widthWindow = getWindowWidth();
    if (widthWindow <= 479 && !grid) {
      setGrid(true);
      setCropSizeImage(getCropSize(cropSize));
    } else if (widthWindow > 479 && grid) {
      setGrid(false);
      setCropSizeImage(getCropSize(cropSize));
    }
  }, [cropSize, grid]);
  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
    return (_) => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);
  const onCropChange = (cord) => {
    setCrop(cord);
  };
  useEffect(() => {
    setMaxZoom(selectedFile.selectedFile.maxZoom);
    setStep(Math.round((selectedFile.selectedFile.maxZoom - 1) * 20) / 100);
  }, [selectedFile.selectedFile.maxZoom]);
  const imageCreate = (url) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
      image.src = url;
    });
  };
  const getAngleRadian = (degreeValue) => {
    return (degreeValue * Math.PI) / 180;
  };
  const getImageCrop = async (imageSrc, pixelCrop, rotation = 0) => {
    let image = null;
    try {
      image = await imageCreate(imageSrc);
    } catch (e) {
      return false;
    }
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
    ctx.rotate(getAngleRadian(rotation));
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
  const handleSave = async () => {
    setLoading(true);
    const canvas = await getImageCrop(selectedFile.selectedFile.url, croppedArea);
    setLoading(false);
    if (canvas) {
      let fileUrl = canvas.toDataURL("image/jpeg", 0.9);
      let img = new Image();
      img.src = fileUrl;
      img.onload = () => {
        let file = dataURLtoFile(fileUrl, "test.png");
        const { width: _width, height: _height, widthActual: _widthActual, heightActual: _heightActual } = getImageSize(img.naturalWidth, img.naturalHeight, layoutId, getScreen());
        handleSaveImages(file, fileUrl, selectedFile.index, {
          cropCordinates: croppedArea,
          zoomLevel: zoom,
          crop: crop,
          calculate: {
            width: _width,
            height: _height,
            widthActual: _widthActual,
            heightActual: _heightActual,
          },
        });
      };
    }
  };
  const onCropComplete = (areaCropped, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };
  const handleCancel = () => {
    setImageCropper(false);
  };
  const { imageCalculate } = getImageContainer(selectedFile.selectedFile, cropSizeImage, layoutId, zoom);
  return (
    <>
      <div className={`crop-section ${imageLayoutClass}`}>
        <div className="crop-section-container">
          <div
            className="crop-container"
            /*style={{
                    //width:selectedFile.selectedFile.calculate.widthActual,
                    //height:selectedFile.selectedFile.calculate.heightActual+80
                    width: cropSizeImage.width+cropSizeImage.width*30/100 ,
                    height: cropSizeImage.height+cropSizeImage.height*1.5/100,
                    ...horizantal?{marginTop:"15px",
                    marginBottom:"15px"}:{}
                    }}*/
          >
            <div className="left-landscape image-crop">
              <Cropper
                image={selectedFile.selectedFile.url}
                crop={crop}
                zoom={zoom}
                minZoom={minZoom}
                maxZoom={maxZoom > 1 ? maxZoom : 1}
                zoomSpeed={minZoom}
                zoomWithScroll={true}
                aspect={aspect}
                showGrid={grid}
                cropSize={imageCalculate}
                onCropChange={onCropChange}
                onCropComplete={onCropComplete}
                onZoomChange={(zoomValue) => {
                  let round = Math.round(zoomValue * 100) / 100;
                  round >= 1 && setZoom(round);
                }}
              />
            </div>
          </div>
        </div>
        {selectedFile.selectedFile.maxZoom > 1 && step > 0 && (
          <div className="controls">
            <div className="mr-4 ">
              <Icon
                type="minus"
                size="small"
                color="secondary"
                background
                handleClick={() => {
                  if (zoom - step < minZoom) {
                    setZoom(minZoom);
                  } else {
                    setZoom(Math.round((zoom - step) * 100) / 100);
                  }
                }}
                disabled={zoom <= minZoom}
              />
            </div>
            <Slider
              value={zoom}
              min={minZoom}
              max={maxZoom}
              step={0.00000001}
              aria-labelledby="continuous-slider"
              onChange={(e, zoomVal) => {
                setZoom(zoomVal);
              }}
              classes={{ root: "slider" }}
            />
            <div className="ml-4">
              <Icon
                type="plus"
                size="small"
                className="ml-3"
                background
                color="secondary"
                handleClick={() => {
                  if (zoom + step > maxZoom) {
                    setZoom(maxZoom);
                  } else {
                    setZoom(Math.round((zoom + step) * 100) / 100);
                  }
                }}
                disabled={zoom >= maxZoom}
              />
            </div>
          </div>
        )}
        <div className="flex justify-end mt-5 bottom-buttons">
          <div className="mr-2">
            <Button type="default" size="large" tkey={"pedigree.dialog.form.btn.cancel"} handleClick={handleCancel} />
          </div>
          <Button type="primary" size="large" disabled={loading} tkey={"pedigree.dialog.form.btn.save"} handleClick={handleSave} loading={loading} />
        </div>
      </div>
    </>
  );
};
const ImageEdit = ({ selectedFile, imageCropper, setImageCropper, handleSaveImages, imageLoading, layoutId, aspect = 1, cropSize, layout = "", imageLayoutClass = "", ...rest }) => {
  useEffect(() => {
    const bool = document.body.classList.contains("overflow-hidden");
    if (imageCropper) {
      !bool && document.body.classList.add("overflow-hidden");
    } else if (bool) {
      document.body.classList.remove("overflow-hidden");
    }
  }, [imageCropper]);
  return <TailwindModal title={"Crop Your Photo"} showClose={true} classes={`crop-modal ${layout} crop-layout`} content={<CropperImage {...rest} imageLayoutClass={imageLayoutClass} setImageCropper={setImageCropper} handleSaveImages={handleSaveImages} imageLoading={imageLoading} selectedFile={imageCropper} cropSize={cropSize} layoutId={layoutId} />} showModal={imageCropper} setShowModal={setImageCropper} />;
};

export default ImageEdit;
