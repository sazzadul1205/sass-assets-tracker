// src/app/Manager/AssetCategories/page.jsx
"use client";

// Next Auth
import { useSession } from "next-auth/react";

// Icons
import { FaInbox, FaPlus } from "react-icons/fa";

// Packages
import { useQuery } from "@tanstack/react-query";

// Shared 
import Error from "@/Shared/Error/Error";
import Loading from "@/Shared/Loading/Loading";

// Hooks
import useAxiosPublic from "@/Hooks/useAxiosPublic";

// Shared Modal
import CreatedDepartmentModal from "@/Shared/AssetCategories/CreatedDepartmentModal/CreatedDepartmentModal";

const page = () => {
  const axiosPublic = useAxiosPublic();
  const { data: session, status } = useSession();


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
  if (AssetCategoriesIsLoading || status === "loading") return <Loading />;

  // Handle errors
  if (AssetCategoriesError) {
    console.error(AssetCategoriesError);
    const errorMessage =
      typeof AssetCategoriesError === "string"
        ? AssetCategoriesError
        : AssetCategoriesError?.response?.data?.message || AssetCategoriesError?.message || "Something went wrong.";
    return <Error message={errorMessage} />;
  }


  console.log(AssetCategoriesData);


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

      {/* Create Department Modal */}
      <dialog id="Create_New_Category_Modal" className="modal">
        <CreatedDepartmentModal
          Refetch={AssetCategoriesRefetch}
          UserEmail={session?.user?.email}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

    </div>
  );
};

export default page;