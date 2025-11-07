// src/app/Manager/AllAssets/page.jsx
"use client";

// React  
import { useEffect, useState } from "react";

// Next Auth
import { useSession } from "next-auth/react";

// Icons
import { FaCubes, FaEdit, FaEye, FaTrash, FaSearch, FaInbox, FaAngleLeft, FaAngleRight } from 'react-icons/fa';

// Packages
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAxiosPublic from '@/Hooks/useAxiosPublic';

// Shared
import Error from "@/Shared/Error/Error";
import Loading from "@/Shared/Loading/Loading";
import SharedHeader from '@/Shared/SharedHeader/SharedHeader';
import CategoryToIcon from "@/Shared/Manager/AllAssets/CategoryToIcon/CategoryToIcon";

// Modals
import EditAssetModal from "@/Shared/Manager/AllAssets/EditAssetModal/EditAssetModal";
import CreatedAssetModal from "@/Shared/Manager/AllAssets/CreatedAssetModal/CreatedAssetModal";
import ViewAssetModal from "@/Shared/Manager/AllAssets/ViewAssetModal/ViewAssetModal";

const page = () => {
  const axiosPublic = useAxiosPublic();
  const { data: session, status } = useSession();

  // Selected Asset State
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [deletingAssetsId, setDeletingAssetsId] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  // Fetch Assets with filters & pagination
  const {
    data: AssetsData,
    error: AssetsError,
    refetch: AssetsRefetch,
    isLoading: AssetsIsLoading,
  } = useQuery({
    queryKey: [
      "AssetsData",
      currentPage,
      searchQuery,
      itemsPerPage,
      selectedCategory,
      selectedBrand,
      selectedCondition,
    ],
    queryFn: () =>
      axiosPublic
        .get(`/Assets`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: searchQuery,
            category: selectedCategory,
            brand: selectedBrand,
            condition: selectedCondition,
          },
        })
        .then((res) => res.data),
    keepPreviousData: true,
  });

  // Fetch AssetsCondition
  const {
    data: AssetsConditionData,
    error: AssetsConditionError,
    refetch: AssetsConditionRefetch,
    isLoading: AssetsConditionIsLoading,
  } = useQuery({
    queryKey: ["AssetsConditionData"],
    queryFn: () =>
      axiosPublic.get(`/Assets/Condition`).then((res) => res.data.data),
    keepPreviousData: true,
  });

  // Fetch AssetsBrands
  const {
    data: AssetsBrandsData,
    error: AssetsBrandsError,
    refetch: AssetsBrandsRefetch,
    isLoading: AssetsBrandsIsLoading,
  } = useQuery({
    queryKey: ["AssetsBrandsData"],
    queryFn: () =>
      axiosPublic.get(`/Assets/Brands`).then((res) => res.data.data),
    keepPreviousData: true,
  });

  // Fetch Categories
  const {
    data: CategoryData,
    error: CategoryError,
    refetch: CategoryRefetch,
    isLoading: CategoryIsLoading
  } = useQuery({
    queryKey: ["Category"],
    queryFn: () => axiosPublic.get(`/AssetCategories`).
      then(res => res.data.data),
    keepPreviousData: true,
  });

  // Fetch Assets Category
  const {
    data: AssetsCategoryData,
    error: AssetsCategoryError,
    refetch: AssetsCategoryRefetch,
    isLoading: AssetsCategoryIsLoading
  } = useQuery({
    queryKey: ["AssetsCategoryData"],
    queryFn: () => axiosPublic.get(`/Assets/Category`).
      then(res => res.data.data),
    keepPreviousData: true,
  });

  // Merge Assets & Category
  const mergedCategoryData = AssetsCategoryData?.map(assetCat => {
    const category = CategoryData?.find(cat => cat._id === assetCat.category_id);
    return {
      ...assetCat,
      category_name: category ? category.category_name : null, category_code: category ? category.category_code : null
    };
  });

  // Total pages
  const totalPages = AssetsData?.totalPages || 1;

  // Handle Delete Asset
  const refetchAll = () => {
    AssetsRefetch();
    CategoryRefetch();
    AssetsBrandsRefetch();
    AssetsCategoryRefetch();
    AssetsConditionRefetch();
    AssetCategoriesNamesRefetch();
  }

  // Auto refetch Assets on filter change
  useEffect(() => {
    setCurrentPage(1); // reset pagination when filters change
  }, [searchQuery, selectedCategory, selectedBrand, selectedCondition]);

  // Handle Loading
  if (
    CategoryIsLoading ||
    status === "loading" ||
    AssetsBrandsIsLoading ||
    AssetsCategoryIsLoading ||
    AssetsConditionIsLoading ||
    AssetCategoriesNamesIsLoading
  ) return <Loading />;

  // Handle errors
  if (
    AssetsError ||
    CategoryError ||
    AssetsBrandsError ||
    AssetsCategoryError ||
    AssetsConditionError ||
    AssetCategoriesNamesError
  ) {
    console.error("AssetsError:", AssetsError);
    console.error("CategoryError:", CategoryError);
    console.error("AssetsBrandsError:", AssetsBrandsError);
    console.error("AssetsCategoryError:", AssetsCategoryError);
    console.error("AssetsConditionError:", AssetsConditionError);
    console.error("AssetCategoriesNamesError:", AssetCategoriesNamesError);


    // Pass all errors to the Error component as an array
    return <Error errors={[
      AssetsError,
      CategoryError,
      AssetsBrandsError,
      AssetsCategoryError,
      AssetsConditionError,
      AssetCategoriesNamesError,
    ]} />;
  }

  // Delete Assets Handler
  const handleDeleteAsset = async (id) => {
    if (!id) return;

    try {
      // Show confirmation modal
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will permanently delete the asset Assets.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (!result.isConfirmed) return; // User cancelled

      setDeletingAssetsId(id); // Start loading for this Assets

      // Delete API call
      const response = await axiosPublic.delete(`/Assets/${id}`);
      if (response.data?.success) {
        refetchAll(); // Refresh data

        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Asset Assets deleted successfully.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        throw new Error(response.data?.message || "Failed to delete Assets.");
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.message || "Something went wrong while deleting the Assets.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setDeletingAssetsId(null); // Stop loading
    }
  };

  return (
    <div className="p-5">
      {/* Header Section */}
      <SharedHeader
        icon={<FaCubes size={28} className="text-blue-600" />}
        title="All Assets"
        description="View and manage all company assets in one place."
        tip="Tip: Keep asset details updated for smooth tracking."
        buttonLabel="Add New Asset"
        onAddClick={() => document.getElementById("Create_New_Asset_Modal")?.showModal()}
      />

      {/* Filter Section */}
      <div className="bg-white border border-gray-200 rounded-xl flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 p-5">
        {/* Search Box */}
        <div className="flex items-center gap-3 flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <FaSearch className="text-gray-500 text-lg" />
          <input
            type="text"
            placeholder="Search by asset name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Brand Dropdown */}
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="min-w-52 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 cursor-pointer bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        >
          <option value="">All Brands</option>
          {[...new Set(AssetsBrandsData?.filter(Boolean))]?.map((brand, idx) => (
            <option key={idx} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        {/* Condition Dropdown */}
        <select
          value={selectedCondition}
          onChange={(e) => setSelectedCondition(e.target.value)}
          className="min-w-52 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 cursor-pointer bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        >
          <option value="">All Conditions</option>
          {[...new Set(AssetsConditionData?.filter(Boolean))]?.map((cond, idx) => (
            <option key={idx} value={cond}>
              {cond}
            </option>
          ))}
        </select>

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="min-w-52 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 cursor-pointer bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        >
          <option value="">All Categories</option>
          {mergedCategoryData?.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.category_name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4 relative">
        {AssetsIsLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <Loading />
          </div>
        )}

        {/* Table */}
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          {/* Table Header */}
          <thead className="bg-gray-100">
            <tr>
              {[
                { label: "Category", align: "left" },
                { label: "Asset Name", align: "left" },
                { label: "Brand", align: "left" },
                { label: "Condition", align: "center" },
                { label: "Purchase Price", align: "center" },
                { label: "Warranty Period", align: "center" },
                { label: "Current Status", align: "center" },
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
            {AssetsData?.data?.length > 0 ? (
              AssetsData?.data?.map((asset, index) => (
                <TableContent
                  asset={asset}
                  index={index}
                  key={asset.asset_id || index}
                  deletingAssetsId={deletingAssetsId}
                  setSelectedAsset={setSelectedAsset}
                  handleDeleteAsset={handleDeleteAsset}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <FaInbox className="text-4xl mb-3 text-gray-400" />
                    <p className="text-base font-semibold">No asset found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your filters or adding a new asset.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-5">
          <div className="join shadow rounded-lg overflow-hidden">
            <button
              className={`join-item px-5 py-2 font-medium text-black bg-white border border-gray-300 rounded-l-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaAngleLeft />
            </button>

            <button className="join-item px-5 py-2 font-medium text-black bg-white border-none cursor-default" disabled>
              Page {currentPage} / {totalPages}
            </button>

            <button
              className={`join-item px-5 py-2 font-medium text-black bg-white border border-gray-300 rounded-r-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

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

const TableContent = ({ asset, index, deletingAssetsId, setSelectedAsset, handleDeleteAsset }) => {
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

      {/* Department */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
        {asset.purchase_price || "—"}
      </td>

      {/* Assigned To */}
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

      {/* Created At */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
        {asset.current_status || "—"}
      </td>

      {/* Actions */}
      <td className="flex justify-center py-4 px-3 gap-3">
        {/* View Details */}
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
          className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg transition-all duration-200 w-28 shadow-md hover:shadow-lg 
                        ${deletingAssetsId === asset?._id ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"}`}
          disabled={deletingAssetsId === asset?._id}
          onClick={() => handleDeleteAsset(asset?._id)}
        >
          {deletingAssetsId === asset?._id ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <>
              <FaTrash className="text-base" />
              Delete
            </>
          )}
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Delete Assets
          </span>
        </button>
      </td>

    </tr>
  )
}