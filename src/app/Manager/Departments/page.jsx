
// src/app/Manager/Departments/page.jsx
"use client";

// React components
import React from 'react';

// Next Auth
import { useSession } from 'next-auth/react';

// Icons
import { FaPlus } from 'react-icons/fa';

// assets
import Department from '../../../../public/svgs/Department';

// Shared
import Loading from '@/Shared/Loading/Loading';

// Shared Modal
import CreatedDepartmentModal from '@/Shared/Manager/CreatedDepartmentModal/CreatedDepartmentModal';

const page = () => {
  const { data: session, status } = useSession()


  // Loading Handler
  if (
    status === "loading"
  ) return <Loading />;

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
            View and manage all registered departments in the system
          </p>

        </div>

        {/* Add Button */}
        <button
          onClick={() => document.getElementById("Created_Department_Modal").showModal()}
          className="flex items-center gap-3 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold border border-blue-700
            shadow-md hover:shadow-xl hover:bg-blue-700 hover:text-white transition-all
            duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          <FaPlus size={23} className="transition-colors duration-300" />
          Create a New Department
        </button>

      </div>



      {/* Created Department Modal */}
      <dialog id="Created_Department_Modal" className="modal">
        <CreatedDepartmentModal
          // Refetch={refetch}
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