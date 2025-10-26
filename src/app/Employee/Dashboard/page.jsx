"use client";

// React
import React from "react";
import { LuUserRoundCheck } from "react-icons/lu";

// Icons
import { MdOutlineSpaceDashboard } from "react-icons/md";

const Page = () => {
  return (
    <div className="p-5" >
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

        {/* Right Section — Badge */}
        <div className="gap-3 mt-3 sm:mt-0 items-center flex text-right">
          {/* Role Badge */}
          <span
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-100 
            text-blue-700 text-sm font-semibold rounded-full shadow-sm 
            border border-blue-200 transition-all duration-300 
            ease-in-out hover:bg-blue-200 hover:text-blue-800 
            hover:scale-105 cursor-default"
          >
            <LuUserRoundCheck size={16} className="text-blue-600 group-hover:text-blue-800" />
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




    </div>
  );
};

export default Page;
