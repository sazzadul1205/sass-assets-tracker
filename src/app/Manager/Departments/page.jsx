// src/app/Manager/Departments/page.jsx
"use client";

// React Components
import React, { useState } from "react";

// Next Components
import { useSession } from "next-auth/react";

// Icons
import { FaPlus, FaEye, FaEdit, FaInbox } from "react-icons/fa";

// Packages
import { useQuery } from "@tanstack/react-query";

// Assets
import Department from "../../../../public/svgs/Department";

// Shared 
import Error from "@/Shared/Error/Error";
import Loading from "@/Shared/Loading/Loading";

// Hooks
import useAxiosPublic from "@/Hooks/useAxiosPublic";

// Shared Modal
import EditDepartmentModal from "@/Shared/Manager/Departments/EditDepartmentModal/EditDepartmentModal";
import ViewDepartmentModal from "@/Shared/Manager/Departments/ViewDepartmentModal/ViewDepartmentModal";
import CreatedDepartmentModal from "@/Shared/Manager/Departments/CreatedDepartmentModal/CreatedDepartmentModal";

const Page = () => {
  const axiosPublic = useAxiosPublic();
  const { data: session, status } = useSession();

  // Stated
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Fetch Departments
  const {
    data: DepartmentsData,
    error: DepartmentsError,
    refetch: DepartmentsRefetch,
    isLoading: DepartmentsIsLoading,
  } = useQuery({
    queryKey: ["DepartmentsData"],
    queryFn: () =>
      axiosPublic.get(`/Departments`).then((res) => res.data.data),
    keepPreviousData: true,
  });

  // Handle Loading
  if (DepartmentsIsLoading || status === "loading") return <Loading />;

  // Handle errors
  if (DepartmentsError) {
    console.error(DepartmentsError);
    const errorMessage =
      typeof DepartmentsError === "string"
        ? DepartmentsError
        : DepartmentsError?.response?.data?.message || DepartmentsError?.message || "Something went wrong.";
    return <Error message={errorMessage} />;
  }

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 flex items-center gap-2">
            <Department color="#3B82F6" width={40} height={40} />
            All Departments
          </h1>
          <p className="mt-1 text-gray-500 text-sm sm:text-base">
            Manage all company departments, roles, and budgets
          </p>
        </div>

        {/* Add Button */}
        <button
          onClick={() =>
            document.getElementById("Created_Department_Modal").showModal()
          }
          className="flex items-center gap-3 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold border border-blue-700
            shadow-md hover:shadow-xl hover:bg-blue-700 transition-all
            duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          <FaPlus size={22} />
          Create a New Department
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          {/* Table Header */}
          <thead className="bg-gray-100">
            <tr>
              {[
                { label: "Code", align: "center" },
                { label: "Department Name", align: "left" },
                { label: "Budget (Annual)", align: "center" },
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
            {DepartmentsData && DepartmentsData.length > 0 ? (
              DepartmentsData.map((dept, index) => {
                const columns = [
                  // Department Code
                  { value: dept.department_Code || "—", align: "center" },

                  // Department Name + Description
                  {
                    value: (
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {dept.department_Name}
                        </p>
                        <p className="text-xs text-gray-500 italic">
                          {dept.description || "No description provided"}
                        </p>
                      </div>
                    ),
                    align: "left",
                  },

                  // Budget
                  {
                    value: dept.budget?.annual
                      ? `$${dept.budget.annual.toLocaleString()}`
                      : "—",
                    align: "center",
                  },

                  // Created At
                  {
                    value: new Date(dept.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }),
                    align: "center",
                  },

                  // Actions
                  {
                    value: (
                      <div className="flex justify-center gap-3">
                        {/* View Button */}
                        <button
                          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 w-36 shadow-md hover:shadow-lg group relative"
                          onClick={() => {
                            setSelectedDepartment(dept);
                            document.getElementById("View_Department_Modal").showModal();
                          }}
                        >
                          <FaEye className="text-base" />
                          View
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            View Department Details
                          </span>
                        </button>

                        {/* Edit Button */}
                        <button
                          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 w-36 shadow-md hover:shadow-lg group relative"
                          onClick={() => {
                            setSelectedDepartment(dept);
                            document.getElementById("Edit_Department_Modal").showModal();
                          }}
                        >
                          <FaEdit className="text-base" />
                          Edit
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Edit Department
                          </span>
                        </button>
                      </div>
                    ),
                    align: "center",
                  },
                ];

                return (
                  <tr
                    key={dept._id || index}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    {columns.map((col, i) => (
                      <td
                        key={i}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-default ${col.align === "left"
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
                <td colSpan={8} className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    {/* Subtle Icon */}
                    <FaInbox className="text-4xl mb-3 text-gray-400" />

                    {/* Message */}
                    <p className="text-base font-semibold">No departments found</p>

                    {/* Tip */}
                    <p className="text-sm text-gray-400 mt-1">
                      Add a new department to start managing your organization.
                    </p>
                  </div>
                </td>
              </tr>

            )}
          </tbody>

        </table>
      </div>

      {/* Create Department Modal */}
      <dialog id="Created_Department_Modal" className="modal">
        <CreatedDepartmentModal
          Refetch={DepartmentsRefetch}
          UserEmail={session?.user?.email}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Edit Department Modal */}
      <dialog id="Edit_Department_Modal" className="modal">
        <EditDepartmentModal
          Refetch={DepartmentsRefetch}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* View Department Modal */}
      <dialog id="View_Department_Modal" className="modal">
        <ViewDepartmentModal
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Page;
