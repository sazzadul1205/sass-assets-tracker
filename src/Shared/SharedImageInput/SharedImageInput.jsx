// React Components
import { useState, useCallback, useEffect } from "react";

// Packages
import Cropper from "react-easy-crop";

// Icons`
import { FaUpload } from "react-icons/fa";

// Utils
import { getCroppedImgCircular } from "../../Utils/getCroppedImg";

const SharedImageInputCircular = ({
  onChange,
  width = 256,
  height = 256,
  IconSize = 32,
  clear = false,
  maxSizeMB = 32,
  rounded = "full",
  enableCrop = true,
  defaultImage = null,
  label = "Profile Image",
  hint = "Drag & drop or click to upload",
}) => {
  // State
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [imageSrc, setImageSrc] = useState(null); 
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Update imageSrc if defaultImage changes
  useEffect(() => {
    if (defaultImage) {
      setImageSrc(defaultImage); // show default image
    }
  }, [defaultImage]);

  // Clear image when clear prop changes to true
  useEffect(() => {
    if (clear) {
      setImageSrc(null); // remove image preview
      setCroppedAreaPixels(null); // reset crop area
      setCrop({ x: 0, y: 0 }); // reset crop position
      setZoom(1); // reset zoom
    }
  }, [clear]);

  // Callback when cropping is complete
  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels); // save cropped pixels
  }, []);

  // Handle file upload
  const handleFile = (file) => {
    if (!file) return;

    // Check file type
    const acceptedTypes = ["image/jpeg", "image/png"];
    if (!acceptedTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG/PNG allowed.");
      return;
    }

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Max size is ${maxSizeMB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      setError("");
      const imgData = reader.result;

      if (enableCrop) {
        setImageSrc(imgData); // show uploaded image
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        document.getElementById("crop_modal")?.showModal(); // open crop modal
      } else {
        setImageSrc(imgData);
        if (onChange) {
          const blob = await fetch(imgData).then((res) => res.blob());
          onChange(new File([blob], file.name, { type: file.type })); // send file to parent
        }
      }
    };

    reader.readAsDataURL(file); // read file as base64
  };

  // Open crop modal manually
  const handleOpenCrop = () => {
    if (enableCrop && imageSrc) {
      document.getElementById("crop_modal")?.showModal(); // show modal
    }
  };

  // Confirm crop
  const handleCropConfirm = async () => {
    try {
      const croppedFile = await getCroppedImgCircular(imageSrc, croppedAreaPixels); // crop image
      const previewUrl = URL.createObjectURL(croppedFile); // preview cropped file
      setImageSrc(previewUrl);
      if (onChange) onChange(croppedFile); // send file to parent
      document.getElementById("crop_modal")?.close(); // close modal
    } catch (err) {
      console.error(err);
      setError("Failed to crop image."); // show error if fails
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-2">
      {/* Label */}
      {label && (
        <label className="block text-gray-700 text-center font-semibold">{label}</label>
      )}

      {/* Image Preview */}
      <div
        className={`relative flex items-center justify-center border-2 border-dashed border-gray-400 hover:border-blue-500 cursor-pointer overflow-hidden mx-auto group rounded-${rounded}`}
        style={{ width, height }}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]); // handle drag & drop
        }}
        onDragOver={(e) => e.preventDefault()}
        onClick={enableCrop ? handleOpenCrop : undefined} // click to crop
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Preview"
            className={`w-full h-full object-cover rounded-${rounded}`} // show image
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400 transition-colors duration-200">
            <FaUpload
              size={IconSize}
              className="text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
            />
            <span className="text-center group-hover:text-blue-500 transition-colors duration-200">
              {hint} {/* show hint text */}
            </span>
          </div>
        )}

        {/* File Input */}
        <input
          type="file"
          accept="image/jpeg,image/png"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => handleFile(e.target.files[0])} // handle file select
        />
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Cropper Modal */}
      {enableCrop && (
        <dialog id="crop_modal" className="modal">
          <div className="modal-box flex flex-col items-center space-y-4 bg-white text-black">
            <h3 className="font-bold text-lg">Crop Your Image</h3>

            {imageSrc && (
              <div
                className={`relative bg-gray-200 overflow-hidden rounded-${rounded}`}
                style={{ width: 256, height: 256 }}
              >
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1} // square crop
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
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
                onChange={(e) => setZoom(Number(e.target.value))} // adjust zoom
                className="ml-2 w-32"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between gap-2 w-full mt-4">
              {/* Confirm Crop */}
              <button
                type="button"
                onClick={handleCropConfirm}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Confirm Crop
              </button>

              {/* Close Modal */}
              <button
                type="button"
                onClick={() => document.getElementById("crop_modal")?.close()}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default SharedImageInputCircular;
