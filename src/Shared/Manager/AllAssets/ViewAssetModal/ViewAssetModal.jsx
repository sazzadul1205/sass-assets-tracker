// src/Shared/Employee/MyAssets/ViewAssetModal/ViewAssetModal.jsx
import {
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiTag,
  FiBox,
  FiInfo,
  FiCoffee,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiClipboard,
} from "react-icons/fi";
import { ImCross } from "react-icons/im";
import CategoryToIcon from "../CategoryToIcon/CategoryToIcon";

// Map fields to icons, labels, and optional color
const assetFields = [
  { key: "asset_code", label: "Asset Code", icon: FiTag },
  { key: "brand_name", label: "Brand", icon: FiBox },
  { key: "serial_number", label: "Serial Number", icon: FiClipboard },
  { key: "purchase_date", label: "Purchase Date", icon: FiCalendar, formatDate: true },
  { key: "purchase_price", label: "Purchase Price", icon: FiDollarSign, prefix: "৳" },
  { key: "supplier_name", label: "Supplier", icon: FiCoffee },
  { key: "warranty_period", label: "Warranty Period", icon: FiClock, suffix: "months" },
  { key: "warranty_expiry_date", label: "Warranty Expiry", icon: FiCalendar, formatDate: true },
  { key: "depreciation_rate", label: "Depreciation Rate", icon: FiXCircle, suffix: "%" },
  { key: "condition", label: "Condition", icon: FiCheckCircle },
  { key: "department_name", label: "Department", icon: FiUser },
  { key: "assigned_to", label: "Assigned To", icon: FiUser },
  { key: "current_status", label: "Current Status", icon: FiInfo },
  { key: "createdBy", label: "Created By", icon: FiUser },
  { key: "createdAt", label: "Created At", icon: FiCalendar, formatDate: true },
  { key: "updatedAt", label: "Last Updated", icon: FiCalendar, formatDate: true },
];

const ViewAssetModal = ({ selectedAsset, setSelectedAsset }) => {
  if (!selectedAsset) return null;

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
        <div className="font-semibold flex items-center gap-2">
          {selectedAsset.category_id && <CategoryToIcon category={selectedAsset} />}
          <div>
            <h3>
              {selectedAsset.asset_name}
            </h3>
            <p className="text-sm text-gray-600">{selectedAsset.serial_number}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="hover:text-red-500 cursor-pointer transition-colors duration-300"
        >
          <ImCross className="text-xl" />
        </button>
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
        {assetFields.map(({ key, label, icon: Icon, formatDate, prefix = "", suffix = "" }) => {
          const value = selectedAsset[key];
          if (!value) return null;

          let displayValue = value;
          if (formatDate) {
            displayValue = new Date(value).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
          }

          return (
            <div key={key} className="flex items-center gap-2">
              <Icon className="text-gray-500" />
              <div>
                <h4 className="font-medium text-gray-600 text-sm">{label}</h4>
                <p className="text-gray-800">{prefix}{displayValue}{suffix}</p>
              </div>
            </div>
          );
        })}

        {/* Private / Public */}
        <div className="flex items-center gap-2">
          <FiInfo className="text-gray-500" />
          <div>
            <h4 className="font-medium text-gray-600 text-sm">Visibility</h4>
            <p
              className={`font-semibold px-2 py-1 rounded-lg text-sm inline-block ${selectedAsset.isPrivate
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
                }`}
            >
              {selectedAsset.isPrivate ? "Private" : "Public"}
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
