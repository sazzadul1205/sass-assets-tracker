// src/app/Manager/Employees/page.jsx
"use client";

// React components
import { useEffect, useState } from 'react';

// Next Components
import Image from 'next/image';

// Icons
import { FaSearch, FaUsers } from 'react-icons/fa';
import { FaEye, FaEdit } from 'react-icons/fa';

// Packages
import { useQuery } from '@tanstack/react-query';

// Hooks
import useAxiosPublic from '@/Hooks/useAxiosPublic';

// Shared
import Error from '@/Shared/Error/Error';
import Loading from '@/Shared/Loading/Loading';

// Modals
import ViewEmployeeDataModal from '@/Shared/Manager/Employees/ViewEmployeeDataModal/ViewEmployeeDataModal';
import UpdateEmployeeDataModal from '@/Shared/Manager/Employees/UpdateEmployeeDataModal/UpdateEmployeeDataModal';

const page = () => {
  const axiosPublic = useAxiosPublic();

  // States
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Search Term State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");


  // Example options (you can fetch from server if needed)
  const departmentOptions = ["HR", "Finance", "Engineering", "Marketing"];
  const positionOptions = ["Manager", "Engineer", "Analyst", "Intern"];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim().toLowerCase());
    }, 300); // 300ms delay is usually enough
    return () => clearTimeout(handler);
  }, [searchTerm]);

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

  // Filter users based on search and filters
  const filteredUsers = UsersData?.filter((user) => {
    const matchesSearch =
      debouncedSearch === "" ||
      user.name.toLowerCase().includes(debouncedSearch) ||
      user.email.toLowerCase().includes(debouncedSearch) ||
      user.department_name?.toLowerCase().includes(debouncedSearch);

    const matchesDepartment =
      selectedDepartment === "" || user.department_name === selectedDepartment;

    const matchesPosition =
      selectedPosition === "" || user.position_name === selectedPosition;

    return matchesSearch && matchesDepartment && matchesPosition;
  });

  // Loading state
  if (UsersIsLoading) return <Loading />;

  // Error state
  if (UsersError) {
    console.error(UsersError);
    const errorMessage =
      typeof UsersError === "string"
        ? UsersError
        : UsersError?.response?.data?.message || UsersError?.message || "Something went wrong.";
    return <Error message={errorMessage} />;
  }

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 flex items-center gap-2">
            <FaUsers size={28} className="text-blue-600" />
            All Employees
          </h1>
          <p className="mt-1 text-gray-500 text-sm sm:text-base">
            View and manage all registered employees in the system
          </p>
          <p className="mt-2 text-xs sm:text-sm text-gray-400 italic">
            Tip: Use search and filters to quickly find specific employees.
          </p>
        </div>
      </div>

      {/* Search and Filters  */}
      <div className="bg-white border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5">
        {/* Search Input */}
        <div className="flex items-center gap-3 flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <FaSearch className="text-gray-500 text-lg" />
          <input
            type="text"
            placeholder="Search employees by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Department Dropdown */}
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="min-w-64 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
        >
          <option value="">All Departments</option>
          {departmentOptions.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Position Dropdown */}
        <select
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
          className="min-w-64 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
        >
          <option value="">All Positions</option>
          {positionOptions.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
      </div>


      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          {/* Table Header */}
          <thead className="bg-gray-100">
            <tr>
              {[
                { label: "#", align: "center" },
                { label: "User", align: "left" },
                { label: "User Address", align: "left" },
                { label: "Department", align: "left" },
                { label: "Position", align: "left" },
                { label: "Phone", align: "left" },
                { label: "Hired At", align: "center" },
                { label: "Actions", align: "center" }
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
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => {
                const columns = [
                  { value: index + 1, align: "center" },
                  {
                    value: (
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="avatar">
                          <div className="w-12 rounded-full">
                            <Image
                              src={user?.profileImage ? user?.profileImage : "/Placeholders/User.png"}
                              alt="User"
                              width={100}
                              height={100}
                            />
                          </div>
                        </div>

                        {/* Name and Email */}
                        <div>
                          {/* Name */}
                          <p className="text-sm font-semibold text-gray-800" >{user.name}</p>

                          {/* Email */}
                          <p className="text-xs text-gray-500" >{user.email}</p>
                        </div>
                      </div>
                    ), align: "left"
                  },
                  { value: user.address || "Not Set Yet", align: "left" },
                  { value: user.department_name || "Not Set Yet", align: "left" },
                  { value: user.position_name || "Not Set Yet", align: "left" },
                  { value: user.phone || "Not Given", align: "left" },
                  {
                    value: user.hire_time
                      ? new Date(user.hire_time).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                      : "Not Set Yet",
                    align: "center",
                  },
                  {
                    value: (
                      <div className="flex justify-center gap-3">

                        {/* View Button */}
                        <button
                          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 w-40 shadow-md hover:shadow-lg group relative"
                          onClick={() => {
                            setSelectedEmployee(user);
                            document.getElementById("View_Employee_Data_Modal").showModal();
                          }}
                        >
                          <FaEye className="text-base" />
                          View Information
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            View User Details
                          </span>
                        </button>

                        {/* Edit Button */}
                        <button
                          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 w-40 shadow-md hover:shadow-lg group relative"
                          onClick={() => {
                            setSelectedEmployee(user);
                            document.getElementById("Update_Employee_Data_Modal").showModal();
                          }}
                        >
                          <FaEdit className="text-base" />
                          Edit Information
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Edit User Information
                          </span>
                        </button>
                      </div>
                    ),
                    align: "center"
                  }
                ];

                return (
                  <tr key={user._id} className="border-t border-gray-200 hover:bg-gray-50">
                    {columns.map((col, idx) => (
                      <td
                        key={idx}
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
                <td
                  colSpan={8} // span all columns
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No Employees Admitted At found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Employee Data Modal */}
      <dialog id="View_Employee_Data_Modal" className="modal">
        <ViewEmployeeDataModal
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Update Employee Data Modal */}
      <dialog id="Update_Employee_Data_Modal" className="modal">
        <UpdateEmployeeDataModal
          refetch={UsersRefetch}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>

  );
};

export default page;