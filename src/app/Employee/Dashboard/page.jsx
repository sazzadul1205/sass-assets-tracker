// src/app/Employee/Dashboard/page.jsx
"use client";

// Next Auth
import { useSession } from "next-auth/react";

// React
import React, { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";


// Icons
import { LuUserRoundCheck } from "react-icons/lu";

// Icons
import { MdOutlineSpaceDashboard } from "react-icons/md";

// Hooks
import useAxiosPublic from "@/Hooks/useAxiosPublic";

// Shared
import Error from "@/Shared/Error/Error";
import Loading from "@/Shared/Loading/Loading";

// Shared Components
import LogLists from "@/Shared/Employee/EmployeeDashboard/LogLists/LogLists";
import QuickAccess from "@/Shared/Employee/EmployeeDashboard/QuickAccess/QuickAccess ";
import RequestStatusCards from "@/Shared/Employee/MyRequests/RequestStatusCards/RequestStatusCards";


const Page = () => {
  const axiosPublic = useAxiosPublic();
  const { data: session, status } = useSession();

  // Selected Status State
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Pagination for logs
  const [logPage, setLogPage] = useState(1);
  const logLimit = 10;

  // ---------- Requests Status Query ----------
  const {
    data: RequestsStatusData,
    error: RequestsStatusError,
    isLoading: RequestsStatusIsLoading,
  } = useQuery({
    queryKey: ["RequestsStatusData", session?.user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Requests/Created_by/${session?.user?.email}/Status`)
        .then((res) => res.data),
    enabled: !!session?.user?.email,
  });

  // ---------- Log Status Query with Pagination ----------
  const {
    data: LogStatusData,
    error: LogStatusError,
    isLoading: LogStatusIsLoading,
  } = useQuery({
    queryKey: ["LogStatusData", session?.user?.email, logPage],
    queryFn: () => {
      const params = new URLSearchParams({
        page: logPage.toString(),
        limit: logLimit.toString(),
      });
      return axiosPublic
        .get(`/Log/${session?.user?.email}?${params}`)
        .then((res) => res.data);
    },
    enabled: !!session?.user?.email,
    keepPreviousData: true,
  });

  // Combined Loading
  if (RequestsStatusIsLoading || LogStatusIsLoading || status === "loading")
    return <Loading />;

  // Error Handling
  if (RequestsStatusError || LogStatusError) {
    console.error("RequestsStatusError:", RequestsStatusError);
    console.error("LogStatusError:", LogStatusError);

    // Pass all errors to the Error component as an array
    return <Error errors={[RequestsStatusError, LogStatusError]} />;
  }

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        {/* Left Section */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 flex items-center gap-2">
            <MdOutlineSpaceDashboard size={30} className="text-blue-600" />
            Employee Dashboard
          </h1>

          {/* Subheader */}
          <p className="mt-1 text-gray-600 text-sm sm:text-base">
            Welcome to your dashboard. Track your assets, requests, and profile information all in one place.
          </p>

          {/* Tip */}
          <p className="mt-2 text-xs sm:text-sm text-gray-400 italic">
            Tip: Use the sidebar to quickly navigate between your assets, receipts, and profile.
          </p>
        </div>

        {/* Right Section — Badge & Date */}
        <div className="gap-3 mt-3 sm:mt-0 items-center flex text-right">
          {/* Role Badge */}
          <span
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-100 
            text-blue-700 text-sm font-semibold rounded-full shadow-sm 
            border border-blue-200 transition-all duration-300 
            ease-in-out hover:bg-blue-200 hover:text-blue-800 
            hover:scale-105 cursor-default"
          >
            <LuUserRoundCheck size={16} className="text-blue-600" />
            Employee
          </span>

          {/* Date */}
          <span className="text-lg font-semibold text-gray-500 cursor-default">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* My Requests */}
      <div className="mt-5">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">My Requests</h3>

        <RequestStatusCards
          disabled={true}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          RequestsStatusData={RequestsStatusData}
        />
      </div>

      {/* Quick Access Section */}
      <QuickAccess />

      {/* Logs Section */}
      <LogLists
        logPage={logPage}
        setLogPage={setLogPage}
        LogStatusData={LogStatusData}
      />
    </div>
  );
};

export default Page;
