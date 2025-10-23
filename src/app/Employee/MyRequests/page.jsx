// src/app/Employee/MyRequests/page.jsx
"use client";

// Next Components
import { useSession } from 'next-auth/react';

// React components
import React from 'react';

// Packages
import { useQuery } from '@tanstack/react-query';

// Icons
import { MdAdd } from 'react-icons/md';

// Shared
import Error from '@/Shared/Error/Error';
import Loading from '@/Shared/Loading/Loading';
import CreateNewRequestModal from '@/Shared/MyRequests/CreateNewRequestModal/CreateNewRequestModal';

// Hooks
import useAxiosPublic from '@/Hooks/useAxiosPublic';
import RequestStatusCards from '@/Shared/MyRequests/RequestStatusCards/RequestStatusCards';
import RequestCard from '@/Shared/MyRequests/RequestCard/RequestCard';


const page = () => {
  const axiosPublic = useAxiosPublic();

  // Next.js Hooks
  const { data: session, status } = useSession();

  // ------------- Requests Query -------------
  const {
    data: requests,
    error,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["Requests", session?.user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Requests/${session?.user?.email}`)
        .then((res) => res.data.requests),
    enabled: !!session?.user?.email,
  });

  // Loading state
  if (
    isLoading,
    status === "loading"
  ) {
    return <Loading />;
  }

  // Error state
  if (error) {
    console.log(error);
    // Get a friendly message from the error
    const errorMessage =
      typeof error === "string"
        ? error
        : error?.response?.data?.message || error?.message || "Something went wrong.";

    return <Error message={errorMessage} />;
  }

  return (
    <div className='p-5' >
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

      <RequestStatusCards
        data={{
          pending: 5,
          completed: 12,
          rejected: 2,
          cancelled: 1,
          accepted: 8,
          inProgress: 3,
        }}
      />

      {/* Divider */}
      <div className="flex items-center justify-center my-4">
        <span className="flex-1 h-px bg-gray-300"></span>
        <span className="px-4 text-gray-500 font-medium">X</span>
        <span className="flex-1 h-px bg-gray-300"></span>
      </div>


      {/* Request Cards */}
      <div className="gap-2 space-y-4 pt-3">
        {requests?.map((request) => (
          <RequestCard key={request._id} request={request} />
        ))}
      </div>

      {/* Create New Request Modal */}
      <dialog id="Create_New_Request_Modal" className="modal">
        <CreateNewRequestModal
          Refetch={refetch}
          sessionData={session}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default page;