// src/app/Manager/AllAssets/page.jsx
"use client";

// React  
import { useState } from "react";

// Next Auth
import { useSession } from "next-auth/react";

// Icons
import { FaCubes } from 'react-icons/fa';

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
import CreatedAssetModal from "@/Shared/Manager/AllAssets/CreatedAssetModal/CreatedAssetModal";
import CategoryToIcon from "@/Shared/Manager/AllAssets/CategoryToIcon/CategoryToIcon";

const page = () => {
  const axiosPublic = useAxiosPublic();
  const { data: session, status } = useSession();

  // Selected Asset State
  const [selectedAsset, setSelectedAsset] = useState(null);

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
  console.log(AssetsData);

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
                { label: "Code", align: "left" },
                { label: "Category Name", align: "left" },
                { label: "Depreciation Rate (%)", align: "center" },
                { label: "Expected Life", align: "center" },
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
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  {/* Category Icon */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-left">
                    {asset?.category_id ? (
                      <CategoryToIcon category={asset} />
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Asset Code */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-left">
                    {asset.asset_code || "—"}
                  </td>

                  {/* Category Name */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-left">
                    {asset.category_id?.category_name || "—"}
                  </td>

                  {/* Depreciation Rate */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {asset.depreciation_rate ?? "—"}
                  </td>

                  {/* Expected Life */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {asset.expected_life ?? "—"}
                  </td>

                  {/* Created At */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : "—"}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {/* Placeholder for actions (edit/delete) */}
                    <button className="text-blue-600 hover:underline">Edit</button>
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