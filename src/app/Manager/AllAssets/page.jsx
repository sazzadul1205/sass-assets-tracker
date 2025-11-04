// src/app/Manager/AllAssets/page.jsx
"use client";

// React  
import { useState } from "react";

// Next Auth
import { useSession } from "next-auth/react";

// Icons
import { FaCubes, FaEdit, FaEye, FaTrash } from 'react-icons/fa';

// Packages
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAxiosPublic from '@/Hooks/useAxiosPublic';

// Shared
import Error from "@/Shared/Error/Error";
import Loading from "@/Shared/Loading/Loading";
import SharedHeader from '@/Shared/SharedHeader/SharedHeader';

// Modals
import EditAssetModal from "@/Shared/Manager/AllAssets/EditAssetModal/EditAssetModal";
import CategoryToIcon from "@/Shared/Manager/AllAssets/CategoryToIcon/CategoryToIcon";
import CreatedAssetModal from "@/Shared/Manager/AllAssets/CreatedAssetModal/CreatedAssetModal";
import ViewAssetModal from "@/Shared/Manager/AllAssets/ViewAssetModal/ViewAssetModal";

const page = () => {
  const axiosPublic = useAxiosPublic();
  const { data: session, status } = useSession();

  // Selected Asset State
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [categoriesArray, setCategoriesArray] = useState([]);

  // Fetch Asset Categories Names & _id
  const {
    data: AssetCategoriesNamesData,
    error: AssetCategoriesNamesError,
    refetch: AssetCategoriesNamesRefetch,
    isLoading: AssetCategoriesNamesIsLoading,
  } = useQuery({
    queryKey: ["AssetCategoriesNamesData"],
    queryFn: () =>
      axiosPublic.get(`/AssetCategories/Names`).then((res) => res.data.data),
    keepPreviousData: true,
  });

  // Fetch Assets
  const {
    data: AssetsData,
    error: AssetsError,
    refetch: AssetsRefetch,
    isLoading: AssetsIsLoading,
  } = useQuery({
    queryKey: ["AssetsData"],
    queryFn: () =>
      axiosPublic.get(`/Assets`).then((res) => res.data.data),
    keepPreviousData: true,
  });

  // Handle Loading
  if (
    AssetCategoriesNamesIsLoading ||
    status === "loading" ||
    AssetsIsLoading
  ) return <Loading />;

  // Handle errors
  if (AssetsError || AssetCategoriesNamesError) {
    console.error(AssetCategoriesNamesError);
    const errorMessage =
      typeof AssetCategoriesNamesError === "string"
        ? AssetCategoriesNamesError
        : AssetCategoriesNamesError?.response?.data?.message || AssetCategoriesNamesError?.message || "Something went wrong.";
    return <Error message={errorMessage} />;
  }

  const refetchAll = () => {
    AssetsRefetch();
    AssetCategoriesNamesRefetch();
  }

  // Handle category fetched from CategoryToIcon
  const handleCategoryFetched = (cat) => {
    setCategoriesArray((prev) => {
      // avoid duplicates
      if (!prev.find((c) => c._id === cat._id)) {
        return [...prev, cat];
      }
      return prev;
    });
  };

  console.log(AssetCategoriesNamesData);

  return (
    <div className="p-5">
      {/* Header Section */}
      <SharedHeader
        icon={<FaCubes size={28} className="text-blue-600" />} // icon is customizable
        title="All Assets"
        description="View and manage all company assets in one place."
        tip="Tip: Keep asset details updated for smooth tracking."
        buttonLabel="Add New Asset"
        onAddClick={() => document.getElementById("Create_New_Asset_Modal")?.showModal()}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          {/* Table Header */}
          <thead className="bg-gray-100">
            <tr>
              {[
                { label: "Category", align: "left" },
                { label: "Asset Name", align: "left" },
                { label: "Brand", align: "left" },
                { label: "Condition", align: "center" },
                { label: "Department", align: "center" },
                { label: "assigned_to", align: "center" },
                { label: "Created At", align: "center" },
                { label: "Actions", align: "center" },
              ].map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${col.align === "left"
                    ? "text-left"
                    : col.align === "center"
                      ? "text-center"
                      : "text-right"
                    }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {AssetsData && AssetsData.length > 0 ? (
              AssetsData.map((asset, index) => (
                <tr
                  key={asset._id || index}
                  className="border-t border-gray-200 hover:bg-gray-50 transition text-gray-900"
                >
                  {/* Category Icon */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-left cursor-default">
                    {asset?.category_id ? (
                      <CategoryToIcon
                        category={asset}
                        onCategoryFetched={handleCategoryFetched}
                      />
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Asset Code */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-left cursor-default">
                    {asset.asset_name || "—"}
                  </td>

                  {/* Brand Name */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-left cursor-default">
                    {asset.brand_name || "—"}
                  </td>

                  {/* Condition */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
                    {asset.condition || "—"}
                  </td>

                  {/* Department */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
                    {asset.department || "—"}
                  </td>

                  {/* Assigned To */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
                    {asset.assigned_to || "—"}
                  </td>

                  {/* Created At */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
                    {asset.createdAt
                      ? new Date(asset.createdAt).toLocaleDateString()
                      : "—"}
                  </td>

                  {/* Actions */}
                  <td className="flex justify-center py-4 px-3 gap-3">
                    {/* View Details */}
                    <button
                      className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 w-32 shadow-md hover:shadow-lg"
                      onClick={() => handleViewDetails(asset)}
                    >
                      <FaEye className="text-base" />
                      View
                    </button>

                    {/* Edit */}
                    <button
                      className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 w-28 shadow-md hover:shadow-lg"
                      onClick={() => {
                        setSelectedAsset(asset);
                        document.getElementById("Edit_Asset_Modal").showModal();
                      }}
                    >
                      <FaEdit className="text-base" />
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 w-28 shadow-md hover:shadow-lg"
                      onClick={() => handleDeleteAsset(asset._id)}
                    >
                      <FaTrash className="text-base" />
                      Delete
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <p className="text-base font-semibold">No assets found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Asset Modal */}
      <dialog id="Create_New_Asset_Modal" className="modal">
        <CreatedAssetModal
          Refetch={refetchAll}
          UserEmail={session?.user?.email}
          CategoriesOptions={AssetCategoriesNamesData}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Edit Asset Modal */}
      <dialog id="Edit_Asset_Modal" className="modal">
        <EditAssetModal
          Refetch={refetchAll}
          selectedAsset={selectedAsset}
          UserEmail={session?.user?.email}
          setSelectedAsset={setSelectedAsset}
          CategoriesOptions={AssetCategoriesNamesData}
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
    </div>
  );
};

export default page;