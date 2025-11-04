// src/app/Manager/AllAssets/page.jsx
"use client";

// React  
import { useMemo, useState } from "react";

// Next Auth
import { useSession } from "next-auth/react";

// Icons
import { FaCubes, FaEdit, FaEye, FaTrash, FaSearch, FaInbox } from 'react-icons/fa';

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
import Swal from "sweetalert2";

const page = () => {
  const axiosPublic = useAxiosPublic();
  const { data: session, status } = useSession();

  // Selected Asset State
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [categoriesArray, setCategoriesArray] = useState([]);
  const [deletingAssetsId, setDeletingAssetsId] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

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

  // Derived Dropdown Data
  const uniqueBrands = [...new Set(AssetsData?.map((a) => a.brand_name).filter(Boolean))];
  const uniqueConditions = [...new Set(AssetsData?.map((a) => a.condition).filter(Boolean))];
  const uniqueStatuses = [...new Set(AssetsData?.map((a) => a.current_status).filter(Boolean))];

  // Filter Logic
  const filteredAssets = useMemo(() => {
    if (!Array.isArray(AssetsData)) return [];

    return AssetsData.filter((asset) => {
      const matchesSearch = asset?.asset_name?.toLowerCase()?.includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand ? asset.brand_name === selectedBrand : true;
      const matchesCondition = selectedCondition ? asset.condition === selectedCondition : true;
      const matchesCategory = selectedCategory ? asset.category_id === selectedCategory : true;
      const matchesStatus = selectedStatus ? asset.current_status === selectedStatus : true;

      return matchesSearch && matchesBrand && matchesCondition && matchesCategory && matchesStatus;
    });
  }, [AssetsData, searchQuery, selectedBrand, selectedCondition, selectedCategory, selectedStatus]);


  // Handle category fetched from CategoryToIcon
  const handleCategoryFetched = (cat) => {
    setCategoriesArray((prev) =>
      prev.find((c) => c._id === cat._id) ? prev : [...prev, cat]
    );
  };

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

  // Handle Delete Asset
  const refetchAll = () => {
    AssetsRefetch();
    AssetCategoriesNamesRefetch();
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
        icon={<FaCubes size={28} className="text-blue-600" />} // icon is customizable
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
          {uniqueBrands.map((brand, idx) => (
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
          {uniqueConditions.map((cond, idx) => (
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
          {categoriesArray.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.category_name}
            </option>
          ))}
        </select>

        {/* Current Status Dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="min-w-52 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 cursor-pointer bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        >
          <option value="">All Statuses</option>
          {uniqueStatuses.map((stat, idx) => (
            <option key={idx} value={stat}>
              {stat}
            </option>
          ))}
        </select>
      </div>

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
            {filteredAssets && filteredAssets?.length > 0 ? (
              filteredAssets?.map((asset, index) => (
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
                    {asset.department || "—"}
                  </td>

                  {/* Assigned To */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
                    {asset.assigned_to || "—"}
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
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center">
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