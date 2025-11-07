// src/Shared/EmployeeNavbar/EmployeeNavbar.jsx
"use client";

// Next Components
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

// Packages
import { useQuery } from "@tanstack/react-query";

// Assets
import Logo from "../../../../public/Auth_Assets/SAT_Logo.png";

// Hooks
import useAxiosPublic from "@/Hooks/useAxiosPublic";

const EmployeeNavbar = () => {
  const pathname = usePathname();

  // Hooks
  const axiosPublic = useAxiosPublic();
  const { data: session, status } = useSession();

  // ---------- Users Data Query ----------
  const {
    data: UserData,
    isLoading: UserIsLoading,
    error: UserError,
  } = useQuery({
    queryKey: ["UserData", session?.user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Users/${session?.user?.email}`)
        .then((res) => res.data.user),
    enabled: !!session?.user?.email,
  });

  // Derive the active page name from the path
  const getPageTitle = () => {
    if (pathname.includes("Profile")) return "Employee Profile";
    if (pathname.includes("MyAssets")) return "Employee Assets";
    if (pathname.includes("Dashboard")) return "Employee Dashboard";
    if (pathname.includes("MyRequests")) return "Employee Requests";
    if (pathname.includes("AssetRecept")) return "Employee Asset Recept";
    return "Employee Side";
  };

  return (
    <div className="navbar bg-white items-center shadow-xl">
      {/* Navbar Start */}
      <div className="navbar-start">
        <Link href="/" passHref>
          <Image
            src={Logo}
            alt="SAT Logo"
            width={300}
            height={100}
            priority
            className="cursor-pointer"
          />
        </Link>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <h3 className="text-black font-bold text-xl">
          <span className="text-blue-500 text-2xl">[</span>
          <span className="px-3 pb-2">{getPageTitle()}</span>
          <span className="text-red-500 text-2xl">]</span>
        </h3>
      </div>

      {/* Navbar End */}
      <div className="navbar-end text-black gap-3 px-5">
        {/* Loading State */}
        {UserIsLoading || status === "loading" ? (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        ) : UserError ? (
          // Error State
          <div className="text-red-500 text-sm font-semibold">
            Failed to load user
          </div>
        ) : (
          // Loaded State
          <>
            {/* Avatar */}
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img
                  src={
                    UserData?.profileImage ||
                    "https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
                  }
                  alt={UserData?.name || "Profile"}
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <h3 className="font-semibold">{UserData?.name || "John Doe"}</h3>
              <h3 className="text-sm text-gray-600">{UserData?.email || "Manager@gmail.com"}</h3>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeNavbar;


