// src/app/Employee/MyAssets/page.jsx
"use client";

// React components
import { useState } from 'react';

// Next Auth
import { useSession } from 'next-auth/react';


// Icons
import { FaEye, FaUserPlus, FaWallet } from 'react-icons/fa';
import { FaBoxOpen } from 'react-icons/fa';

// Packages
import { useQuery } from '@tanstack/react-query';


// Hooks
import useAxiosPublic from '@/Hooks/useAxiosPublic';

// Shared
import Error from '@/Shared/Error/Error';
import Loading from '@/Shared/Loading/Loading';
import CategoryToIcon from '@/Shared/Manager/AllAssets/CategoryToIcon/CategoryToIcon';
import AssetReturnTime from '@/Shared/Manager/AllAssets/AssetReturnTime/AssetReturnTime';

// Modal
import ViewAssetModal from '@/Shared/Manager/AllAssets/ViewAssetModal/ViewAssetModal';
import ViewRequestModal from '@/Shared/Employee/MyAssets/ViewRequestModal/ViewRequestModal';
import AssetServiceModal from '@/Shared/Employee/MyAssets/AssetServiceModal/AssetServiceModal';

const Page = () => {
  const axiosPublic = useAxiosPublic();
  const { data: session, status } = useSession();

  // Select State
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Fetch Users Data
  const {
    data: UsersData,
    error: UsersError,
    isLoading: UsersIsLoading,
  } = useQuery({
    queryKey: ["UserData", session?.user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Users/${session?.user?.email}`)
        .then((res) => res.data.user),
    enabled: !!session?.user?.email,
  });

  // Fetch users assets
  const {
    data: UsersAssetsData,
    error: UsersAssetsError,
    isLoading: UsersAssetsIsLoading,
  } = useQuery({
    queryKey: ["UsersAssetsData", session?.user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Assets/Email/${session?.user?.email}`)
        .then((res) => res.data.assets),
    keepPreviousData: true,
    enabled: !!session?.user?.email,
  });

  // Fetch Department Public
  const {
    data: DepartmentPublicData,
    error: DepartmentPublicError,
    isLoading: DepartmentPublicIsLoading,
  } = useQuery({
    queryKey: ["DepartmentPublicData", UsersData?.department_id],
    queryFn: () =>
      axiosPublic
        .get(`/Assets/DepartmentPublic/${UsersData?.department_id}`)
        .then((res) => res.data.assets),
    keepPreviousData: true,
    enabled: !!UsersData?.department_id,
  });

  // Merge the two arrays safely
  const unifiedAssets = [
    ...(UsersAssetsData || []),
    ...(DepartmentPublicData || []),
  ];

  // Optional: remove duplicates by _id
  const uniqueAssets = Array.from(
    new Map(unifiedAssets.map(item => [item._id, item])).values()
  );

  // Loading state
  if (
    status === "loading" ||
    UsersAssetsIsLoading ||
    DepartmentPublicIsLoading
  ) return <Loading />;

  // Error state
  if (
    UsersError ||
    UsersIsLoading ||
    UsersAssetsError ||
    DepartmentPublicError
  ) {
    console.error("UsersError:", UsersError);
    console.error("UsersIsLoading:", UsersIsLoading);
    console.error("UsersAssetsError:", UsersAssetsError);
    console.error("DepartmentPublicError:", DepartmentPublicError);

    // Pass all errors to the Error component as an array
    return <Error errors={[
      UsersError,
      UsersIsLoading,
      UsersAssetsError,
      DepartmentPublicError,
    ]} />;
  }

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 flex items-center gap-2">
            <FaWallet size={28} className="text-blue-600" />
            My Assets
          </h1>
          <p className="mt-1 text-gray-500 text-sm sm:text-base">
            Manage and view all your assets in one place
          </p>
          <p className="mt-2 text-xs sm:text-sm text-gray-400 italic">
            Tip: Use the filters to search and narrow down assets.
          </p>
        </div>
      </div>

      {/* Assets Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          {/* Table Header */}
          <thead className="bg-gray-100">
            <tr>
              {[
                { label: "Category", align: "left" },
                { label: "Asset Name", align: "left" },
                { label: "Brand", align: "left" },
                { label: "Condition", align: "left" },
                { label: "Warranty Period", align: "center" },
                { label: "Private / Public", align: "center" },
                { label: "Time", align: "center" },
                { label: "Actions", align: "center" },
              ].map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${col.align === "left" ? "text-left" : col.align === "center" ? "text-center" : "text-right"}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {uniqueAssets && uniqueAssets.length > 0 ? (
              uniqueAssets.map((asset, index) => (
                <TableContent
                  asset={asset}
                  index={index}
                  key={asset.asset_id || index}
                  setSelectedAsset={setSelectedAsset}
                />
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FaBoxOpen className="w-12 h-12 text-gray-300" />
                    <p className="text-gray-400 text-sm sm:text-base">
                      No assets found matching your criteria.
                    </p>
                    <p className="text-gray-300 text-xs sm:text-sm">
                      Try adjusting your filters or adding new assets.
                    </p>
                  </div>
                </td>
              </tr>

            )}
          </tbody>
        </table>
      </div>

      {/* Create New Request Modal */}
      <dialog id="View_Request_Modal" className="modal">
        <ViewRequestModal
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* View Asset Modal */}
      <dialog id="View_Asset_Modal" className="modal">
        <ViewAssetModal
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* View Asset Modal */}
      <dialog id="Asset_Return_Or_Repair_Modal" className="modal">
        <AssetServiceModal
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Page;

const TableContent = ({ asset, setSelectedAsset }) => {
  return (
    <tr
      key={asset._id || index}
      className="border-t border-gray-200 hover:bg-gray-50 transition text-gray-900"
    >
      {/* Category Icon */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-left cursor-default">
        {asset?.category_id ? (
          <CategoryToIcon
            category={asset}
          />
        ) : (
          "—"
        )}
      </td>

      {/* Asset Name */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-left cursor-default">
        {asset.asset_name || "—"}
        <p className="text-xs text-gray-500" >{asset?.serial_number || "—"}</p>
      </td>

      {/* Brand Name */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-left cursor-default">
        {asset.brand_name || "—"}
      </td>

      {/* Condition */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
        {asset.condition || "—"}
      </td>

      {/* Warranty Period */}
      <td className=" px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
        {asset.warranty_period || "—"} Month's
        <p className="text-xs text-gray-500" >
          (   {new Date(asset.warranty_expiry_date).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })})
        </p>
      </td>

      {/* Private / Public */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
        {asset?.isPrivate === false ? (
          <div className="inline-flex items-center gap-1 px-4 py-1 mx-auto rounded-lg bg-green-100 text-green-800 font-semibold text-sm">
            Public
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 px-4 py-1 mx-auto rounded-lg bg-blue-100 text-blue-800 font-semibold text-sm">
            Private
          </div>
        )}
      </td>

      {/* Time Left */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
        <AssetReturnTime isLimited={asset?.isLimited} return_date={asset?.return_date} />
      </td>

      {/* Actions */}
      <td className="flex justify-center py-4 px-1 gap-3">
        {/* Return / Repair Button */}
        <button
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap min-w-[8rem]" onClick={() => {
            setSelectedAsset(asset);
            document.getElementById("Asset_Return_Or_Repair_Modal").showModal();
          }}
        >
          <FaUserPlus className="text-base" />
          Return / Repair
        </button>

        {/* View Button */}
        <button
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 w-32 shadow-md hover:shadow-lg"
          onClick={() => {
            setSelectedAsset(asset);
            document.getElementById("View_Asset_Modal").showModal();
          }}
        >
          <FaEye className="text-base" />
          View
        </button>
      </td>
    </tr>
  )
}