// React components
import React, { useState } from "react";

// Icons
import { ImCross } from "react-icons/im";
import { MdAssignmentReturn } from "react-icons/md";
import {
  FaBox,
  FaTools,
  FaSearch,
  FaArrowUp,
  FaLongArrowAltLeft
} from "react-icons/fa"

// Shared
import AssetServiceReturnForm from "./AssetServiceReturnForm/AssetServiceReturnForm";
import AssetServiceRepairForm from "./AssetServiceRepairForm/AssetServiceRepairForm";
import AssetServiceUpgradeForm from "./AssetServiceUpgradeForm/AssetServiceUpgradeForm";

const AssetServiceModal = ({
  Refetch,
  userData,
  selectedAsset,
  setSelectedAsset
}) => {

  // Error
  const [error, setError] = useState(null);

  // Active request
  const [activeRequest, setActiveRequest] = useState(null);

  // Handle Close
  const handleClose = () => {
    setSelectedAsset(null);
    setActiveRequest(null);
    document.getElementById("Asset_Services_Modal").close();
  };

  // Handle request type
  const handleRequestType = (type) => setActiveRequest(type);
  const handleBack = () => setActiveRequest(null);

  return (
    <div
      id="Asset_Services_Modal"
      className="modal-box min-w-3xl max-w-3xl relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full mx-auto max-h-[90vh] px-6 py-5 text-black overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">

        {/* Title */}
        <h3 className="font-bold text-xl flex items-center gap-5">
          <FaBox className="text-blue-600" />
          Asset Service Requests
        </h3>

        {/* Close  */}
        <button
          type="button"
          onClick={handleClose}
          className="hover:text-red-500 cursor-pointer transition-colors duration-300"
        >
          <ImCross className="text-xl" />
        </button>
      </div>

      {/* Divider */}
      <p className="w-[98%] mx-auto h-[1px] bg-gray-300 my-3" />

      {/* Error */}
      {error && (
        <div className="py-3 bg-red-100 border border-red-400 rounded-lg mb-4">
          <p className="text-red-500 font-semibold text-center">{error}</p>
        </div>
      )}

      {/* Default View: Four Buttons */}
      {!activeRequest && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Return Request */}
          <button
            onClick={() => handleRequestType("return")}
            className="flex flex-col items-center justify-center gap-3 px-8 py-10 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
              <MdAssignmentReturn className="text-4xl" />
            </div>
            <span className="font-semibold text-lg text-gray-800">
              Return Request
            </span>
            <p className="text-sm text-gray-500 text-center">
              Submit a request to return an assigned asset.
            </p>
          </button>

          {/* Repair Request */}
          <button
            onClick={() => handleRequestType("repair")}
            className="flex flex-col items-center justify-center gap-3 px-8 py-10 border-2 border-gray-200 rounded-2xl hover:border-yellow-500 hover:bg-yellow-50 transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <div className="p-4 bg-yellow-100 text-yellow-600 rounded-full">
              <FaTools className="text-4xl" />
            </div>
            <span className="font-semibold text-lg text-gray-800">
              Repair Request
            </span>
            <p className="text-sm text-gray-500 text-center">
              Report a damaged asset that needs maintenance.
            </p>
          </button>

          {/* Upgrade Request */}
          <button
            onClick={() => handleRequestType("upgrade")}
            className="flex flex-col items-center justify-center gap-3 px-8 py-10 border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:bg-green-50 transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <div className="p-4 bg-green-100 text-green-600 rounded-full">
              <FaArrowUp className="text-4xl" />
            </div>
            <span className="font-semibold text-lg text-gray-800">
              Upgrade Request
            </span>
            <p className="text-sm text-gray-500 text-center">
              Request a newer or upgraded version of your current asset.
            </p>
          </button>

          {/* Inspection Request */}
          <button
            onClick={() => handleRequestType("inspection")}
            className="flex flex-col items-center justify-center gap-3 px-8 py-10 border-2 border-gray-200 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <div className="p-4 bg-purple-100 text-purple-600 rounded-full">
              <FaSearch className="text-4xl" />
            </div>
            <span className="font-semibold text-lg text-gray-800">
              Inspection Request
            </span>
            <p className="text-sm text-gray-500 text-center">
              Schedule an inspection or maintenance check for your asset.
            </p>
          </button>
        </div>
      )}

      {/* Inside Modal Views */}
      {activeRequest && (
        <div className="mt-1">
          {/* Header */}
          <div className="flex justify-between items-center" >
            {/* Title */}
            <h3 className="text-xl font-semibold" >
              {(() => {
                switch (activeRequest) {
                  case "return":
                    return "Return Request Form";
                  case "repair":
                    return "Repair Request Form";
                  case "upgrade":
                    return "Upgrade Request Form";
                  case "inspection":
                    return "Inspection Request Form";
                  default:
                    return "Select a Request Type";
                }
              })()}
            </h3>

            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 
             rounded-lg shadow-sm hover:bg-blue-700 active:scale-95 transition-all duration-150"
            >
              <FaLongArrowAltLeft className="text-lg" />
              <span>Back to Requests</span>
            </button>

          </div>

          {activeRequest === "return" && (
            <AssetServiceReturnForm
              Refetch={Refetch}
              setError={setError}
              userData={userData}
              handleClose={handleClose}
              selectedAsset={selectedAsset}
            />
          )}

          {activeRequest === "repair" && (
            <AssetServiceRepairForm
              Refetch={Refetch}
              setError={setError}
              userData={userData}
              handleClose={handleClose}
              selectedAsset={selectedAsset}
            />
          )}

          {activeRequest === "upgrade" && (
            <AssetServiceUpgradeForm
              Refetch={Refetch}
              setError={setError}
              userData={userData}
              handleClose={handleClose}
              selectedAsset={selectedAsset}
            />
          )}

          {activeRequest === "inspection" && (
            <></>
          )}
        </div>
      )}
    </div>
  );
};

export default AssetServiceModal;
