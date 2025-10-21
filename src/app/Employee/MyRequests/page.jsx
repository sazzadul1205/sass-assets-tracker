// src/app/Employee/MyRequests/page.jsx
"use client";

import CreateNewRequestModal from '@/Shared/MyRequests/CreateNewRequestModal/CreateNewRequestModal';
// React components
import React from 'react';

// Icons
import { MdAdd } from 'react-icons/md';

const page = () => {
  return (
    <div>
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center ">
        {/* Left Side — Title */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            📋 My Requests
          </h3>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage & Track Your Requests easily in one place.
          </p>
        </div>

        {/* Right Side — Add Button */}
        <button
          onClick={() => document.getElementById('Create_New_Request_Modal').showModal()}
          className="mt-4 sm:mt-0 flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 active:scale-95 transition-all"
        >
          <MdAdd size={20} />
          Add New Request
        </button>
      </div>


      <dialog id="Create_New_Request_Modal" className="modal">
        <CreateNewRequestModal />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default page;