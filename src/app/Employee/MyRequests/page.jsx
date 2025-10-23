// src/app/Employee/MyRequests/page.jsx
"use client";

// Next Components
import { useSession } from 'next-auth/react';

// React components
import React, { useState } from 'react';

// Packages
import { useQuery } from '@tanstack/react-query';

// Icons
import { MdAdd } from 'react-icons/md';

// Shared
import Error from '@/Shared/Error/Error';
import Loading from '@/Shared/Loading/Loading';
import RequestCard from '@/Shared/MyRequests/RequestCard/RequestCard';
import RequestStatusCards from '@/Shared/MyRequests/RequestStatusCards/RequestStatusCards';
import CreateNewRequestModal from '@/Shared/MyRequests/CreateNewRequestModal/CreateNewRequestModal';

// Hooks
import useAxiosPublic from '@/Hooks/useAxiosPublic';


const page = () => {
  const axiosPublic = useAxiosPublic();

  // Selected Status
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Next.js Hooks
  const { data: session, status } = useSession();

  // ------------- Requests Query -------------
  const {
    data: RequestsData,
    error: RequestsError,
    refetch: RequestsRefetch,
    isLoading: RequestsIsLoading,
  } = useQuery({
    queryKey: ["RequestsData", session?.user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Requests/Created_by/${session?.user?.email}`)
        .then((res) => res.data.requests),
    enabled: !!session?.user?.email,
  });

  // ------------- Requests Status Query -------------
  const {
    data: RequestsStatusData,
    error: RequestsStatusError,
    refetch: RequestsStatusRefetch,
    isLoading: RequestsStatusIsLoading,
  } = useQuery({
    queryKey: ["RequestsStatusData", session?.user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/Requests/Created_by/${session?.user?.email}/Status`
      );
      return res.data || { success: false, statusCounts: {} };
    },
    enabled: !!session?.user?.email,
  });


  // Show loading while fetching requests or status, or if a manual loading flag is set
  if (RequestsIsLoading || RequestsStatusIsLoading || status === "loading") {
    return <Loading />;
  }


  // Handle error state for multiple sources
  if (RequestsError || RequestsStatusError) {
    const activeError = RequestsError || RequestsStatusError;
    const errorMessage =
      typeof activeError === "string"
        ? activeError
        : activeError?.response?.data?.message ||
        activeError?.message ||
        "Something went wrong.";
    console.error("Error fetching requests or status:", activeError);
    return <Error message={errorMessage} />;
  }

  // Refetch both requests and status data
  const refetchAll = () => {
    RequestsRefetch?.();
    RequestsStatusRefetch?.();
  };

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

      {/* Status Cards */}
      <RequestStatusCards
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        RequestsStatusData={RequestsStatusData}
      />

      {/* Divider */}
      <div className="flex items-center justify-center my-4">
        <span className="flex-1 h-px bg-gray-300"></span>
        <span className="px-4 text-gray-500 font-medium">X</span>
        <span className="flex-1 h-px bg-gray-300"></span>
      </div>


      {/* Request Cards */}
      <div className="gap-2 space-y-4 pt-3">
        {RequestsData?.map((request) => (
          <RequestCard key={request._id} request={request} Refetch={refetchAll} />
        ))}
      </div>

      {/* Create New Request Modal */}
      <dialog id="Create_New_Request_Modal" className="modal">
        <CreateNewRequestModal
          Refetch={refetchAll}
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