
// Icon
import {
  FiCalendar, FiDollarSign, FiUser, FiTag, FiBox, FiInfo, FiCoffee, FiClock, FiCheckCircle, FiXCircle, FiClipboard
} from "react-icons/fi";
import { ImCross } from "react-icons/im";

// Shared
import CategoryToIcon from "../CategoryToIcon/CategoryToIcon";

const ViewAssetModal = ({ selectedAsset, setSelectedAsset }) => {

  // If no asset is selected, do not render the modal
  if (!selectedAsset) return null;

  // Close modal handler
  const handleClose = () => {
    setSelectedAsset(null);
    document.getElementById("View_Asset_Modal")?.close();
  };

  return (
    <dialog
      id="View_Asset_Modal"
      className="modal-box min-w-[500px] max-w-4xl relative bg-white rounded-lg shadow-xl w-full mx-auto max-h-[90vh] px-6 py-5 text-black overflow-y-auto"
      open
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
        <h2 className="text-2xl font-semibold">{selectedAsset.asset_name}</h2>
        <button
          type="button"
          onClick={handleClose}
          className="hover:text-red-500 cursor-pointer transition-colors duration-300"
        >
          <ImCross className="text-xl" />
        </button>
      </div>

      {/* Top Info */}
      <div className="flex items-center gap-4 mb-6">
        {selectedAsset.category_id && (
          <CategoryToIcon category={selectedAsset} />
        )}
        <div className="space-y-1">
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <FiTag /> Asset Code: <span className="font-medium">{selectedAsset.asset_code}</span>
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <FiBox /> Brand: <span className="font-medium">{selectedAsset.brand_name}</span>
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <FiClipboard /> Serial Number: <span className="font-medium">{selectedAsset.serial_number}</span>
          </p>
        </div>
      </div>

      {/* Description */}
      {selectedAsset.description && (
        <div className="mb-6">
          <h3 className="font-semibold mb-1 flex items-center gap-1">
            <FiInfo /> Description
          </h3>
          <p className="text-gray-700">{selectedAsset.description}</p>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FiCalendar className="text-gray-500" />
          <div>
            <h4 className="font-medium text-gray-600 text-sm">Purchase Date</h4>
            <p className="text-gray-800">
              {new Date(selectedAsset.purchase_date).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-2">
          <FiDollarSign className="text-gray-500" />
          <div>
            <h4 className="font-medium text-gray-600 text-sm">Purchase Price</h4>
            <p className="text-gray-800">৳ {selectedAsset.purchase_price}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FiCoffee className="text-gray-500" />
          <div>
            <h4 className="font-medium text-gray-600 text-sm">Supplier</h4>
            <p className="text-gray-800">{selectedAsset.supplier_name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FiClock className="text-gray-500" />
          <div>
            <h4 className="font-medium text-gray-600 text-sm">Warranty Period</h4>
            <p className="text-gray-800">{selectedAsset.warranty_period} months</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FiCalendar className="text-gray-500" />
          <div>
            <h4 className="font-medium text-gray-600 text-sm">Warranty Expiry</h4>
            <p className="text-gray-800">
              {new Date(selectedAsset.warranty_expiry_date).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-2">
          <FiXCircle className="text-gray-500" />
          <div>
            <h4 className="font-medium text-gray-600 text-sm">Depreciation Rate</h4>
            <p className="text-gray-800">{selectedAsset.depreciation_rate}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FiCheckCircle className="text-gray-500" />
          <div>
            <h4 className="font-medium text-gray-600 text-sm">Condition</h4>
            <p className="text-gray-800">{selectedAsset.condition}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FiUser className="text-gray-500" />
          <div>
            <h4 className="font-medium text-gray-600 text-sm">Department</h4>
            <p className="text-gray-800">{selectedAsset.department}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FiUser className="text-gray-500" />
          <div>
            <h4 className="font-medium text-gray-600 text-sm">Assigned To</h4>
            <p className="text-gray-800">{selectedAsset.assigned_to}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FiInfo className="text-gray-500" />
          <div>
            <h4 className="font-medium text-gray-600 text-sm">Current Status</h4>
            <p className="text-gray-800">{selectedAsset.current_status}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FiUser className="text-gray-500" />
          <div>
            <h4 className="font-medium text-gray-600 text-sm">Created By</h4>
            <p className="text-gray-800">{selectedAsset.createdBy}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FiCalendar className="text-gray-500" />
          <div>
            <h4 className="font-medium text-gray-600 text-sm">Created At</h4>
            <p className="text-gray-800">
              {new Date(selectedAsset.createdAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FiCalendar className="text-gray-500" />
          <div>
            <h4 className="font-medium text-gray-600 text-sm">Last Updated</h4>
            <p className="text-gray-800">
              {new Date(selectedAsset.updatedAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <button
          onClick={handleClose}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </dialog>
  );
};

export default ViewAssetModal;
