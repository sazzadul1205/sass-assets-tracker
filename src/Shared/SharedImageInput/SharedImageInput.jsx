"use client";

// React components
import { useState, useCallback } from "react";

// Packages
import Cropper from "react-easy-crop";

// Icons
import { FaUpload } from "react-icons/fa";

// Utils
import { getCroppedImgCircular } from "../Utils/getCroppedImg";

const SharedImageInputCircular = ({
  onChange,
  width = 256,
  height = 256,
  IconSize = 32,
  maxSizeMB = 32,
  defaultImage = null,
  label = "Profile Image",
  hint = "Drag & drop or click to upload",
}) => {
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [imageSrc, setImageSrc] = useState(defaultImage);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Handle crop
  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // Handle file
  const handleFile = (file) => {
    if (!file) return;

    const acceptedTypes = ["image/jpeg", "image/png"];
    if (!acceptedTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG/PNG allowed.");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Max size is ${maxSizeMB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setError("");
      setCrop({ x: 0, y: 0 }); // reset crop
      setZoom(1);               // reset zoom
      setCroppedAreaPixels(null); // reset cropped area
      document.getElementById("crop_modal").showModal(); // reopen modal
    };
    reader.readAsDataURL(file);
  };

  // Handle crop
  const handleCropConfirm = async () => {
    try {
      const croppedFile = await getCroppedImgCircular(imageSrc, croppedAreaPixels);
      setImageSrc(URL.createObjectURL(croppedFile));
      if (onChange) onChange(croppedFile);
      document.getElementById("crop_modal").close();
    } catch (err) {
      console.error(err);
      setError("Failed to crop image.");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-2">
      {/* Label */}
      {label && <label className="block text-gray-700 text-center font-semibold">{label}</label>}

      {/* Image Preview */}
      <div
        className="relative flex items-center justify-center border-2 border-dashed border-gray-400 hover:border-blue-500 cursor-pointer overflow-hidden mx-auto rounded-full"
        style={{ width, height }}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        {imageSrc ? (
          <img src={imageSrc} alt="Preview" className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <FaUpload size={IconSize} className="text-gray-400 group-hover:text-blue-500" />
            <span className="text-center">{hint}</span>
          </div>
        )}

        <input
          type="file"
          accept="image/jpeg,image/png"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Cropper Modal */}
      <dialog id="crop_modal" className="modal">
        <div className="modal-box flex flex-col items-center space-y-4 bg-white text-black">
          <h3 className="font-bold text-lg">Crop Your Image</h3>

          {imageSrc && (
            <div className="relative w-[256px] h-[256px] bg-gray-200 overflow-hidden rounded-full">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
              {/* Circular overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 51%)",
                  borderRadius: "50%",
                }}
              />
            </div>
          )}

          {/* Zoom Slider */}
          <div className="flex items-center justify-center">
            <label className="text-gray-700 text-sm">Zoom:</label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="ml-2 w-24 sm:w-32 md:w-48"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-2 w-full mt-4">
            <button
              type="button"
              onClick={handleCropConfirm}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Confirm Crop
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("crop_modal").close()}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default SharedImageInputCircular;
