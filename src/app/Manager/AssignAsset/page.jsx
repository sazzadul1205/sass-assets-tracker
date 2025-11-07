// src/app/Manager/AssignAsset/page.jsx
"use client";

// React  
import { useState, useEffect } from "react";

// Next Auth
import { useSession } from "next-auth/react";

// Icons
import { FaEye, FaInbox, FaUserPlus, FaSearch, FaAngleLeft, FaAngleRight, FaSpinner } from 'react-icons/fa';

// SVGs
import AssignAsset from "../../../../public/svgs/AssignAsset";

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
import ViewAssetModal from "@/Shared/Manager/AllAssets/ViewAssetModal/ViewAssetModal";
import AssignAssetModal from "@/Shared/Manager/AssignAsset/AssignAssetModal/AssignAssetModal";
import EmailToUserInfo from "@/Shared/Manager/AssignAsset/EmailToUserInfo/EmailToUserInfo";
import IdToDepartment from "@/Shared/Manager/AssignAsset/IdToDepartment/IdToDepartment";
import AssetReturnTime from "@/Shared/Manager/AllAssets/AssetReturnTime/AssetReturnTime";

const page = () => {
  const axiosPublic = useAxiosPublic();
  const { data: session, status } = useSession();

  // Loading States
  const [loading, setLoading] = useState(false);


  // Selected Asset State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [assignmentStatus, setAssignmentStatus] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedAssignedUser, setSelectedAssignedUser] = useState("");


  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch Users
  const {
    data: UsersData,
    error: UsersError,
    refetch: UsersRefetch,
    isLoading: UsersIsLoading
  } = useQuery({
    queryKey: ["AllUsersData"],
    queryFn: () => axiosPublic.get(`/Users/AllUsers`).
      then(res => res.data.data),
    keepPreviousData: true,
  });

  // Fetch Departments
  const {
    data: DepartmentsData,
    error: DepartmentsError,
    refetch: DepartmentsRefetch,
    isLoading: DepartmentsIsLoading
  } = useQuery({
    queryKey: ["DepartmentsData"],
    queryFn: () => axiosPublic.get(`/Departments/Roles`).
      then(res => res.data.data),
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

  // Fetch Assets with server-side pagination & filters
  const {
    data: AssetsData,
    error: AssetsError,
    refetch: AssetsRefetch,
    isLoading: AssetsIsLoading
  } = useQuery({
    queryKey: [
      "AssetsData",
      currentPage,
      searchQuery,
      itemsPerPage,
      assignmentStatus,
      selectedCategory,
      selectedDepartment,
      selectedAssignedUser,
    ],
    queryFn: () =>
      axiosPublic
        .get(`/Assets`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: searchQuery,
            status: assignmentStatus,
            category: selectedCategory,
            department: selectedDepartment,
            assignedUser: selectedAssignedUser,
          },
        })
        .then((res) => res.data),
    keepPreviousData: true,
  });


  // Fetch Assets Department
  const {
    data: AssetsDepartmentData,
    error: AssetsDepartmentError,
    refetch: AssetsDepartmentRefetch,
    isLoading: AssetsDepartmentIsLoading
  } = useQuery({
    queryKey: ["AssetsDepartmentData"],
    queryFn: () => axiosPublic.get(`/Assets/Departments`).
      then(res => res.data.data),
    keepPreviousData: true,
  });

  // Fetch Assets AssignedTo
  const {
    data: AssetsAssignedToData,
    error: AssetsAssignedToError,
    refetch: AssetsAssignedToRefetch,
    isLoading: AssetsAssignedToIsLoading
  } = useQuery({
    queryKey: ["AssetsAssignedToData"],
    queryFn: () => axiosPublic.get(`/Assets/AssignedTo`).
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

  // Merge Assets & Departments
  const mergedDepartmentData = AssetsDepartmentData?.map(assetDept => {
    const department = DepartmentsData?.find(dep => dep._id === assetDept.department_id);
    return {
      ...assetDept,
      department_Name: department ? department.department_Name : null
    };
  });

  // Merge Assets & AssignedTo
  const mergedAssignedData = AssetsAssignedToData?.map(assignment => {
    const user = UsersData?.find(u => u.email === assignment.group);
    return {
      ...assignment,
      name: user ? user.name : assignment.group
    };
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

  // Refetch all data function
  const refetchAll = () => {
    UsersRefetch();
    AssetsRefetch();
    CategoryRefetch();
    DepartmentsRefetch();
    AssetsCategoryRefetch();
    AssetsAssignedToRefetch();
    AssetsDepartmentRefetch();
  };

  // Auto refetch Assets on filter change
  useEffect(() => {
    setCurrentPage(1); // reset to page 1 on filter/search change
    AssetsRefetch();
  }, [
    searchQuery,
    selectedCategory,
    selectedDepartment,
    selectedAssignedUser
  ]);

  // Page loading: only for session or essential data
  if (
    UsersIsLoading ||
    CategoryIsLoading ||
    DepartmentsIsLoading ||
    status === "loading" ||
    AssetsCategoryIsLoading ||
    AssetsDepartmentIsLoading ||
    AssetsAssignedToIsLoading
  ) return <Loading />;

  // Handle Errors
  if (
    UsersError ||
    AssetsError ||
    CategoryError ||
    DepartmentsError ||
    AssetsCategoryError ||
    AssetsDepartmentError ||
    AssetsAssignedToError
  ) {
    console.error("UsersError:", UsersError);
    console.error("AssetsError:", AssetsError);
    console.error("CategoryError:", CategoryError);
    console.error("DepartmentsError:", DepartmentsError);
    console.error("AssetsCategoryError:", AssetsCategoryError);
    console.error("AssetsDepartmentError:", AssetsDepartmentError);
    console.error("AssetsAssignedToError:", AssetsAssignedToError);

    return <Error
      errors={[
        UsersError,
        AssetsError,
        CategoryError,
        DepartmentsError,
        AssetsCategoryError,
        AssetsDepartmentError,
        AssetsAssignedToError]}
    />;
  }

  // Handle Unassign Asset
  const handleUnAssignAsset = async (asset) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to unassign "${asset.asset_name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Unassign it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      // If confirmed
      if (result.isConfirmed) {
        try {
          setLoading(true);
          // Unassign API call
          const response = await axiosPublic.put(`/Assets/${asset._id}`, {
            department: "Not Assigned",
            assigned_to: "Not Assigned",
            current_status: "Not Assigned",
            assigned_by: "",
            assigned_at: "",
            unsetFields: {
              isLimited: "",
              isPrivate: "",
              return_date: "",
            },
          });

          // If success
          if (response.data.success) {
            Swal.fire({
              icon: "success",
              title: "Asset Unassigned!",
              text: `"${asset.asset_name}" has been successfully unassigned.`,
              timer: 2000,
              showConfirmButton: false,
            });

            // Refetch the assets table
            AssetsRefetch();
          } else {
            // If failed
            Swal.fire({
              icon: "error",
              title: "Failed!",
              text: response.data.message || "Something went wrong while Un Assigning the asset.",
            });
          }
        } catch (error) {
          // If error
          console.error("Unassign error:", error);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: error?.response?.data?.message || "Server error while Un Assigning asset.",
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="p-5">
      {/* Header Section */}
      <SharedHeader
        icon={<AssignAsset color="#3B82F6" width={40} height={40} />}
        title="Assign Assets"
        description="Assign assets to departments or individuals efficiently."
        tip="Tip: Always update assignments to keep tracking accurate."
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

        {/* Assigned User Dropdown */}
        <select
          value={selectedAssignedUser}
          onChange={(e) => setSelectedAssignedUser(e.target.value)}
          className="min-w-52 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 cursor-pointer bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        >
          <option value="">All Users</option>
          {mergedAssignedData?.map((user) => (
            <option key={user.group} value={user.group}>
              {user.name}
            </option>
          ))}
        </select>

        {/* Assigned Department Dropdown */}
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="min-w-52 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 cursor-pointer bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        >
          <option value="">All Departments</option>
          {mergedDepartmentData?.map((dep) => (
            <option key={dep.department_id} value={dep.department_id}>
              {dep.department_Name}
            </option>
          ))}
        </select>

        {/* Assignment Status Toggle */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl p-1 bg-gray-50">
          {["all", "assigned", "unassigned"].map((status) => (
            <button
              key={status}
              onClick={() => setAssignmentStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${assignmentStatus === status
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {status === "all"
                ? "All"
                : status === "assigned"
                  ? "Assigned"
                  : "Unassigned"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4 relative">
        {AssetsIsLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <Loading />
          </div>
        )}

        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          {/* Table Header */}
          <thead className="bg-gray-100">
            <tr>
              {[
                { label: "Category", align: "left" },
                { label: "Asset Name", align: "left" },
                { label: "Assigned To", align: "left" },
                { label: "Department", align: "center" },
                { label: "Current Status", align: "center" },
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
            {AssetsData?.data?.length > 0 ? (
              AssetsData?.data?.map((asset, index) => (
                <TableContent
                  asset={asset}
                  index={index}
                  loading={loading}
                  key={asset.asset_id || index}
                  setSelectedAsset={setSelectedAsset}
                  handleUnAssignAsset={handleUnAssignAsset}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <FaInbox className="text-4xl mb-3 text-gray-400" />
                    <p className="text-base font-semibold">No asset found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or adding a new asset.</p>
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

            <button
              className="join-item px-5 py-2 font-medium text-black bg-white border-none cursor-default"
              disabled
            >
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

      {/* Assign Asset Modal */}
      <dialog id="Assign_Asset_Modal" className="modal">
        <AssignAssetModal
          Refetch={refetchAll}
          UsersData={UsersData}
          selectedAsset={selectedAsset}
          UserEmail={session?.user?.email}
          DepartmentsData={DepartmentsData}
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
    </div>
  );
};

export default page;

// Table Content
const TableContent = ({ asset, loading, index, setSelectedAsset, handleUnAssignAsset }) => {
  return (
    <tr key={asset.asset_id || index} className="border-t border-gray-200 hover:bg-gray-50 transition text-gray-900">
      {/* Category Icon */}
      <td className="px-6 py-4 w-10 whitespace-nowrap text-sm text-left cursor-default">
        {asset?.category_id ? <CategoryToIcon category={asset} /> : "—"}
      </td>

      {/* Asset Name */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-left cursor-default">
        {asset?.asset_name || "—"}
        <p className="text-xs text-gray-500">{asset?.serial_number || "—"}</p>
      </td>

      {/* Assigned To */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
        {asset?.isPrivate === false ? (
          <div className="inline-flex items-center gap-1 px-10 py-1 mx-auto rounded-lg bg-gray-200 text-gray-700 font-semibold text-sm">
            Public
          </div>
        ) : (
          <EmailToUserInfo email={asset?.assigned_to || ""} />
        )}
      </td>

      {/* Department */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
        {asset?.department === "Not Assigned" ? (
          <div className="text-gray-400 italic">Not Assigned</div>
        ) : (
          <IdToDepartment id={asset?.department || ""} />
        )}
      </td>

      {/* Current Status */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
        {asset?.current_status || "—"}
      </td>

      {/* Time Left */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
        <AssetReturnTime isLimited={asset?.isLimited} return_date={asset?.return_date} />
      </td>

      {/* Actions */}
      <td className="flex justify-center py-4 px-3 gap-3">
        {/* Assign/Unassign Button */}
        {asset?.current_status === "Assigned" ? (
          // Show Unassign button
          <button
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 
            transition-all duration-200 w-32 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={() => handleUnAssignAsset(asset)}
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin text-base" /> : <FaInbox className="text-base" />}
            {loading ? "" : "Unassign"}
          </button>
        ) : (
          // Show Assign button
          <button
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 w-32 shadow-md hover:shadow-lg"
            onClick={() => {
              setSelectedAsset(asset);
              document.getElementById("Assign_Asset_Modal").showModal();
            }}
          >
            <FaUserPlus className="text-base" />
            Assign
          </button>
        )}

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
  );
};

