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
import CategoryToIcon from "@/Shared/Manager/AllAssets/CategoryToIcon/CategorytoIcon";

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
              AssetsData.map((asset, index) => {
                const columns = [
                  // Asset Category Code
                  {
                    value:
                      <>
                        <CategoryToIcon category={asset?.category_id} />
                      </> || "—",
                    align: "left",
                  },


                ];

                return (
                  <tr
                    key={asset._id || index}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    {columns.map((col, i) => (
                      <td
                        key={i}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${col.align === "left"
                          ? "text-left"
                          : col.align === "center"
                            ? "text-center"
                            : "text-right"
                          }`}
                      >
                        {col.value}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <FaInbox className="text-4xl mb-3 text-gray-400" />
                    <p className="text-base font-semibold">No assets found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your filters or adding a new category.
                    </p>
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