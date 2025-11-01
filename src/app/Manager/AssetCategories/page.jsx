// src/app/Manager/AssetCategories/page.jsx
"use client";

// React  
import { useState } from "react";

// Next Auth
import { useSession } from "next-auth/react";

// Icons
import { FaEdit, FaInbox, FaPlus, FaTrash } from "react-icons/fa";

// Packages
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

// Shared 
import Error from "@/Shared/Error/Error";
import Loading from "@/Shared/Loading/Loading";

// Hooks
import useAxiosPublic from "@/Hooks/useAxiosPublic";


// Shared Modal
import EditCategoryModal from "@/Shared/Manager/AssetCategories/EditCategoryModal/EditCategoryModal";
import CreatedCategoryModal from "@/Shared/Manager/AssetCategories/CreatedCategoryModal/CreatedCategoryModal";

const page = () => {
  const axiosPublic = useAxiosPublic();
  const { data: session, status } = useSession();

  // Selected Category State
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Add state to track deletion status per category
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  // Fetch AssetCategories
  const {
    data: AssetCategoriesData,
    error: AssetCategoriesError,
    refetch: AssetCategoriesRefetch,
    isLoading: AssetCategoriesIsLoading,
  } = useQuery({
    queryKey: ["AssetCategoriesData"],
    queryFn: () =>
      axiosPublic.get(`/AssetCategories`).then((res) => res.data.data),
    keepPreviousData: true,
  });

  // Handle Loading
  if (
    AssetCategoriesIsLoading ||
    status === "loading"
  ) return <Loading />;

  // Handle errors
  if (AssetCategoriesError) {
    console.error(AssetCategoriesError);
    const errorMessage =
      typeof AssetCategoriesError === "string"
        ? AssetCategoriesError
        : AssetCategoriesError?.response?.data?.message || AssetCategoriesError?.message || "Something went wrong.";
    return <Error message={errorMessage} />;
  }

  // Delete Category Handler
  const handleDeleteCategory = async (id) => {
    if (!id) return;

    try {
      // Show confirmation modal
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will permanently delete the asset category.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (!result.isConfirmed) return; // User cancelled

      setDeletingCategoryId(id); // Start loading for this category

      // Delete API call
      const response = await axiosPublic.delete(`/AssetCategories/${id}`);
      if (response.data?.success) {
        AssetCategoriesRefetch(); // Refresh data

        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Asset Category deleted successfully.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        throw new Error(response.data?.message || "Failed to delete category.");
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.message || "Something went wrong while deleting the category.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setDeletingCategoryId(null); // Stop loading
    }
  };


  return (
    <div className="p-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        {/* Left Side - Title & Info */}
        <div>
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 flex items-center gap-2">
            <FaInbox size={28} className="text-blue-600" />
            Asset Categories
          </h1>

          {/* Description */}
          <p className="mt-1 text-gray-500 text-sm sm:text-base">
            Organize and manage your company's asset categories efficiently.
          </p>

          {/* Tips */}
          <p className="mt-2 text-xs sm:text-sm text-gray-400 italic">
            Tip: Keep categories clear and specific for easier asset tracking.
          </p>
        </div>

        {/* Right Side - Add New Button */}
        <div className="mt-4 sm:mt-0">
          <button
            className="flex items-center gap-3 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold border border-blue-700
            shadow-md hover:shadow-xl hover:bg-blue-700 transition-all
            duration-300 ease-in-out transform hover:-translate-y-0.5"
            onClick={() =>
              document.getElementById("Create_New_Category_Modal").showModal()
            }
          >
            <FaPlus className="text-white" />
            Add New Category
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          {/* Table Header */}
          <thead className="bg-gray-100">
            <tr>
              {[
                { label: "#", align: "left" },
                { label: "Code", align: "left" },
                { label: "Category Name", align: "left" },
                { label: "Depreciation Rate (%)", align: "center" },
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
            {AssetCategoriesData && AssetCategoriesData.length > 0 ? (
              AssetCategoriesData.map((category, index) => {
                const columns = [
                  // Category Code
                  {
                    value: index + 1 || "—",
                    align: "left",
                  },

                  // Category Code
                  {
                    value: category.category_code || "—",
                    align: "left",
                  },

                  // Category Name + Icon + Description
                  {
                    value: (
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 flex items-center justify-center rounded-lg overflow-hidden shadow-sm"
                          style={{
                            backgroundColor: category.icon_color || "#f3f3f3",
                          }}
                        >
                          {category.icon_url ? (
                            <img
                              src={category.icon_url}
                              alt={category.category_name}
                              className="w-9 h-w-9 object-contain"
                            />
                          ) : (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {category.category_name}
                          </p>
                          {category.description ? (
                            <p className="text-xs text-gray-500 italic">
                              {category.description}
                            </p>
                          ) : (
                            <p className="text-xs text-gray-400 italic">
                              No description provided
                            </p>
                          )}
                        </div>
                      </div>
                    ),
                    align: "left",
                  },

                  // Depreciation Rate
                  {
                    value: category.depreciation_rate
                      ? `${category.depreciation_rate}%`
                      : "—",
                    align: "center",
                  },

                  // Created At
                  {
                    value: category.createdAt
                      ? new Date(category.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      : "—",
                    align: "center",
                  },

                  // Actions
                  {
                    value: (
                      <div className="flex justify-center gap-3">
                        {/* Edit Button */}
                        <button
                          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 w-28 shadow-md hover:shadow-lg group relative"
                          onClick={() => {
                            setSelectedCategory(category);
                            document
                              .getElementById("Edit_Category_Modal")
                              .showModal();
                          }}
                        >
                          <FaEdit className="text-base" />
                          Edit
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Edit Category
                          </span>
                        </button>

                        {/* Remove Button */}
                        <button
                          className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg transition-all duration-200 w-28 shadow-md hover:shadow-lg ${deletingCategoryId === category._id ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"
                            }`}
                          disabled={deletingCategoryId === category._id}
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          {deletingCategoryId === category._id ? (
                            <span className="loading loading-spinner loading-sm"></span>
                          ) : (
                            <>
                              <FaTrash className="text-base" />
                              Remove
                            </>
                          )}
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Remove Category
                          </span>
                        </button>
                      </div>
                    ),
                    align: "center",
                  },
                ];

                return (
                  <tr
                    key={category._id || index}
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
                    {/* Subtle Icon */}
                    <FaInbox className="text-4xl mb-3 text-gray-400" />

                    {/* Message */}
                    <p className="text-base font-semibold">No asset categories found</p>

                    {/* Optional Tip */}
                    <p className="text-sm text-gray-400 mt-1">
                      Try adding a new category to get started.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* Create Department Modal */}
      <dialog id="Create_New_Category_Modal" className="modal">
        <CreatedCategoryModal
          Refetch={AssetCategoriesRefetch}
          UserEmail={session?.user?.email}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Edit Category Modal */}
      <dialog id="Edit_Category_Modal" className="modal">
        <EditCategoryModal
          Refetch={AssetCategoriesRefetch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default page;