// src/app/Manager/AssignAsset/page.jsx
"use client";

// React  
import { useMemo, useState } from "react";

// Next Auth
import { useSession } from "next-auth/react";

// Icons
import { FaEye, FaInbox, FaUserPlus } from 'react-icons/fa';

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


const page = () => {
  const axiosPublic = useAxiosPublic();
  const { data: session, status } = useSession();

  // Selected Asset State
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [categoriesArray, setCategoriesArray] = useState([]);
  const [deletingAssetsId, setDeletingAssetsId] = useState(null);

  // Fetch Users
  const {
    data: UsersData,
    error: UsersError,
    refetch: UsersRefetch,
    isLoading: UsersIsLoading
  } = useQuery({
    queryKey: ["AllUsersData"],
    queryFn: () =>
      axiosPublic.get(`/Users/AllUsers`).then(res => res.data.data),
    keepPreviousData: true,
  });

  // Fetch Departments sATA
  const {
    data: DepartmentsData,
    error: DepartmentsError,
    refetch: DepartmentsRefetch,
    isLoading: DepartmentsIsLoading,
  } = useQuery({
    queryKey: ["DepartmentsData"],
    queryFn: () =>
      axiosPublic.get(`/Departments/Roles`).then((res) => res.data.data),
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

  // Fetch Assets Department
  const {
    data: AssetsDepartmentData,
    error: AssetsDepartmentError,
    refetch: AssetsDepartmentRefetch,
    isLoading: AssetsDepartmentIsLoading,
  } = useQuery({
    queryKey: ["AssetsDepartmentData"],
    queryFn: () =>
      axiosPublic.get(`/Assets/Departments`).then((res) => res.data.data),
    keepPreviousData: true,
  });

  // Fetch Assets AssignedTo
  const {
    data: AssetsAssignedToData,
    error: AssetsAssignedToError,
    refetch: AssetsAssignedToRefetch,
    isLoading: AssetsAssignedToIsLoading,
  } = useQuery({
    queryKey: ["AssetsAssignedToData"],
    queryFn: () =>
      axiosPublic.get(`/Assets/AssignedTo`).then((res) => res.data.data),
    keepPreviousData: true,
  });

  // Handle category fetched from CategoryToIcon
  const handleCategoryFetched = (cat) => {
    setCategoriesArray((prev) =>
      prev.find((c) => c._id === cat._id) ? prev : [...prev, cat]
    );
  };

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
    // Find the user whose email matches the group
    const user = UsersData?.find(u => u.email === assignment.group);

    return {
      ...assignment,
      name: user ? user.name : assignment.group
    };
  });

  // Handle Loading
  if (
    UsersError ||
    AssetsIsLoading ||
    status === "loading" ||
    DepartmentsIsLoading ||
    AssetsDepartmentIsLoading || AssetsAssignedToIsLoading
  ) return <Loading />;

  // Handle errors
  if (
    AssetsError ||
    UsersIsLoading ||
    DepartmentsError || AssetsDepartmentError || AssetsAssignedToError
  ) {
    console.error("AssetsError:", AssetsError);
    console.error("UsersIsLoading:", UsersIsLoading);
    console.error("DepartmentsError:", DepartmentsError);
    console.error("AssetsDepartmentError:", AssetsDepartmentError);
    console.error("AssetsAssignedToError:", AssetsAssignedToError);

    // Pass all errors to the Error component as an array
    return <Error errors={[
      AssetsError,
      UsersIsLoading,
      DepartmentsError,
      AssetsDepartmentError,
      AssetsAssignedToError
    ]} />;
  }

  // Handle Delete Asset
  const refetchAll = () => {
    UsersRefetch();
    AssetsRefetch();
    DepartmentsRefetch();
    AssetsAssignedToRefetch();
    AssetsDepartmentRefetch();
  }

  console.log("merged Department Data", mergedDepartmentData);
  console.log("merged Assigned Data", mergedAssignedData);

  return (
    <div className="p-5">
      {/* Header Section */}
      <SharedHeader
        icon={<AssignAsset color="#3B82F6" width={40} height={40} />}
        title="Assign Assets"
        description="Assign assets to departments or individuals efficiently."
        tip="Tip: Always update assignments to keep tracking accurate."
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
                { label: "Assigned To", align: "left" },
                { label: "Department", align: "center" },
                { label: "Current Status", align: "center" },
                { label: "Time", align: "center" },
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
            {AssetsData && AssetsData?.length > 0 ? (
              AssetsData?.map((asset, index) => (
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

                  {/* Assigned To */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
                    {asset?.isPrivate === false ? (
                      <div className="inline-flex items-center gap-1 px-5 py-1 mx-auto rounded-full bg-gray-200 text-gray-700 font-semibold text-sm">
                        Public
                      </div>
                    ) : (
                      <EmailToUserInfo
                        email={asset.assigned_to || ""}
                      />
                    )}
                  </td>

                  {/* Department */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
                    {asset?.department === "Not Assigned" ? (
                      <div className="text-gray-400 italic">Not Assigned</div>
                    ) : (
                      <IdToDepartment
                        id={asset.department || ""}
                      />
                    )}
                  </td>

                  {/* Current Status */}
                  <td className=" px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
                    {asset.current_status || "—"}
                  </td>

                  {/* Time */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-default">
                    {asset?.isLimited ? (
                      asset?.return_date ? (
                        (() => {
                          const now = new Date();
                          const returnDate = new Date(asset.return_date);
                          const diffMs = returnDate - now;

                          if (diffMs <= 0) {
                            return <span className="text-red-500 font-medium">Expired</span>;
                          }

                          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                          const diffMonths = Math.floor(diffDays / 30);
                          const diffYears = Math.floor(diffDays / 365);

                          let timeLeft = "";
                          if (diffYears >= 1) {
                            timeLeft = `${diffYears} year${diffYears > 1 ? "s" : ""}${diffMonths % 12 > 0 ? `, ${diffMonths % 12} month${diffMonths % 12 > 1 ? "s" : ""}` : ""
                              } left`;
                          } else if (diffMonths >= 1) {
                            timeLeft = `${diffMonths} month${diffMonths > 1 ? "s" : ""} left`;
                          } else {
                            timeLeft = `${diffDays} day${diffDays > 1 ? "s" : ""} left`;
                          }

                          return (
                            <div className="flex flex-col items-center">
                              <span className="font-medium text-gray-800">{new Date(asset.return_date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}</span>
                              <span className="text-xs text-gray-500">{timeLeft}</span>
                            </div>
                          );
                        })()
                      ) : (
                        <span className="text-gray-400 italic">No Return Date</span>
                      )
                    ) : (
                      <span className="text-green-600 font-medium">Indefinite Duration</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="flex justify-center py-4 px-3 gap-3">
                    {/* Assign Button */}
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

                    {/* View Details Button */}
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