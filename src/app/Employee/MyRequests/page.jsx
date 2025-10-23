// src/app/Employee/MyRequests/page.jsx
"use client";

// React components
import React, { useState } from "react";

// Next Auth
import { useSession } from "next-auth/react";

// React Query
import { useQuery } from "@tanstack/react-query";

// Icons
import { MdAdd } from "react-icons/md";

// Hooks
import useAxiosPublic from "@/Hooks/useAxiosPublic";

// Shared
import Error from "@/Shared/Error/Error";
import Loading from "@/Shared/Loading/Loading";
import RequestCard from "@/Shared/MyRequests/RequestCard/RequestCard";
import RequestStatusCards from "@/Shared/MyRequests/RequestStatusCards/RequestStatusCards";
import CreateNewRequestModal from "@/Shared/MyRequests/CreateNewRequestModal/CreateNewRequestModal";

const Page = () => {
  const axiosPublic = useAxiosPublic();
  const { data: session, status } = useSession();

  // Selected Status State
  const [selectedStatus, setSelectedStatus] = useState("all");

  // ---------- Requests Query ----------
  const {
    data: RequestsData,
    error: RequestsError,
    refetch: RequestsRefetch,
    isLoading: RequestsIsLoading,
  } = useQuery({
    queryKey: ["RequestsData", session?.user?.email, selectedStatus],
    queryFn: () =>
      axiosPublic
        .get(`/Requests/Created_by/${session?.user?.email}/${selectedStatus}`)
        .then((res) => res.data.requests),
    enabled: !!session?.user?.email,
    keepPreviousData: true,
  });

  // ---------- Requests Status Query ----------
  const {
    data: RequestsStatusData,
    error: RequestsStatusError,
    refetch: RequestsStatusRefetch,
    isLoading: RequestsStatusIsLoading,
  } = useQuery({
    queryKey: ["RequestsStatusData", session?.user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Requests/Created_by/${session?.user?.email}/Status`)
        .then((res) => res.data),
    enabled: !!session?.user?.email,
  });

  // Loading Handler
  if (RequestsIsLoading || RequestsStatusIsLoading || status === "loading") return <Loading />;

  // Error Handler
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

  // Refetch All Handler
  const refetchAll = () => {
    RequestsRefetch?.();
    RequestsStatusRefetch?.();
  };

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">📋 My Requests</h3>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage & Track Your Requests easily in one place.
          </p>
        </div>

        <button
          onClick={() => document.getElementById("Create_New_Request_Modal").showModal()}
          className="mt-4 sm:mt-0 flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 active:scale-95 transition-all"
        >
          <MdAdd size={20} /> Add New Request
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
        <CreateNewRequestModal Refetch={refetchAll} sessionData={session} />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Page;