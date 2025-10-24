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
import { FaChevronLeft, FaChevronRight, FaInbox, FaSearch } from "react-icons/fa";

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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Items per Page
  const itemsPerPage = 5;

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

  // Search Term State
  const isQueryActive = selectedStatus !== "All";


  // ----------- Pagination -----------
  // Calculate Pagination
  const totalRequests = RequestsData?.length || 0;
  const totalPages = Math.ceil(totalRequests / itemsPerPage);
  const paginatedData = RequestsData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination Handlers
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            📋 My Requests
          </h3>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage & Track Your Requests easily in one place.
          </p>

          {/* Tip */}
          <p className="text-xs text-gray-400 mt-1 italic">
            Tip: Click on a request card below to quickly filter and view related requests.
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
      <div className="gap-2 space-y-4">
        {RequestsData && RequestsData.length > 0 ? (
          <>
            {/* Pagination (only show if more than 5 requests) */}
            {totalRequests > itemsPerPage && (
              <div className="flex justify-between items-center pt-2">
                {/* Total Requests Count */}
                <div className="flex">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Total Requests: <span className="text-blue-600">{totalRequests || 0}</span>
                  </h4>
                </div>

                {/* Pagination */}
                <div className="join bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm rounded-xl overflow-hidden">
                  {/* Previous Button */}
                  <button
                    className={`join-item btn border-none font-medium transition-all duration-200 ${currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                      }`}
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                  >
                    <FaChevronLeft />
                  </button>

                  {/* Page Number */}
                  <button className="join-item btn border-none bg-white text-gray-800 font-semibold cursor-default hover:bg-white">
                    Page{" "}
                    <span className="text-blue-600 font-bold mx-1">{currentPage}</span> /{" "}
                    <span className="text-gray-700">{totalPages}</span>
                  </button>

                  {/* Next Button */}
                  <button
                    className={`join-item btn border-none font-medium transition-all duration-200 ${currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                      }`}
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}

            {/* Request Cards */}
            {paginatedData.map((request) => (
              <RequestCard key={request._id} request={request} Refetch={refetchAll} />
            ))}

            {/* Pagination (only show if more than 5 requests) */}
            {totalRequests > itemsPerPage && (
              <div className="flex justify-between items-center pt-2">
                {/* Total Requests Count */}
                <div className="flex">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Total Requests: <span className="text-blue-600">{totalRequests || 0}</span>
                  </h4>
                </div>

                {/* Pagination */}
                <div className="join bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm rounded-xl overflow-hidden">
                  {/* Previous Button */}
                  <button
                    className={`join-item btn border-none font-medium transition-all duration-200 ${currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                      }`}
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                  >
                    <FaChevronLeft />
                  </button>

                  {/* Page Number */}
                  <button className="join-item btn border-none bg-white text-gray-800 font-semibold cursor-default hover:bg-white">
                    Page{" "}
                    <span className="text-blue-600 font-bold mx-1">{currentPage}</span> /{" "}
                    <span className="text-gray-700">{totalPages}</span>
                  </button>

                  {/* Next Button */}
                  <button
                    className={`join-item btn border-none font-medium transition-all duration-200 ${currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                      }`}
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}

          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center transition-all duration-200">
            {/* Icon */}
            <div className="p-4 rounded-full mb-3">
              {isQueryActive ? (
                <FaSearch className="text-3xl text-gray-800" />
              ) : (
                <FaInbox className="text-3xl text-gray-800" />
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-black">
              {isQueryActive ? "No Matching Requests" : "No Requests Found"}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-800 mt-1 max-w-sm">
              {isQueryActive
                ? "Try adjusting your search or filters to find what you’re looking for."
                : "It seems you haven’t made any requests yet. Once you do, they’ll appear here."}
            </p>
          </div>
        )}
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