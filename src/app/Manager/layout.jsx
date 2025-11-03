// src/app/Manager/layout.jsx
"use client";

// Next Components
import { SessionProvider, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

// Icons
import { FiUsers } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaCubes, FaInbox, FaRegUser } from "react-icons/fa";

// Shared
import ManagerNavbar from "@/Shared/Manager/ManagerNavbar/ManagerNavbar";

// SweetAlert for confirmation
import Swal from "sweetalert2";
import Department from "../../../public/svgs/Department";


const layout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  // ---------- Logout Handler ----------
  const handleLogout = async () => {
    // Ask for confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your session.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    // If confirmed
    if (result.isConfirmed) {
      // Feedback toast
      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been successfully logged out.",
        position: "top-start",
        toast: true,
        timer: 2000,
        showConfirmButton: false,
      });

      // Perform sign out and redirect to login
      await signOut({
        redirect: true,
        callbackUrl: "/Auth/Login",
      });
    }
  };

  // Top Menu Items
  const topMenuItems = [
    {
      name: "Dashboard",
      icon: <MdOutlineSpaceDashboard />,
      path: "/Manager/Dashboard",
    },
    {
      name: "Employees",
      icon: <FiUsers />,
      path: "/Manager/Employees",
    },
    {
      name: "Departments",
      icon: <Department className="w-5 h-5" />,
      path: "/Manager/Departments",
    },
    {
      name: "Asset Categories",
      icon: <FaInbox className="w-5 h-5" />,
      path: "/Manager/AssetCategories",
    },
    {
      name: "All Assets",
      icon: <FaCubes className="w-5 h-5" />,
      path: "/Manager/AllAssets",
    },
  ];

  // Bottom Menu Items
  const bottomMenuItems = [
    {
      name: "Profile",
      icon: <FaRegUser />,
      path: "/Manager/Profile",
    },
    {
      name: "Logout",
      icon: <IoLogOutOutline />,
      action: handleLogout,
    },
  ];

  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <ManagerNavbar />

        {/* Main Layout */}
        <main className="flex">
          {/* Sidebar */}
          <aside
            className="w-72 fixed top-[65px] left-0 bottom-0 bg-white shadow-md p-4 border-r border-gray-200 flex flex-col justify-between overflow-y-auto"
            style={{ height: "calc(100vh - 65px)" }}
          >
            {/* Top Menu */}
            <ul className="space-y-2 text-gray-700 font-medium">
              {topMenuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li
                    key={item.name}
                    onClick={() => router.push(item.path)}
                    className={`flex items-center gap-3 cursor-pointer rounded-xl py-2.5 px-3 transition-colors
                      ${isActive
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "hover:bg-gray-100 hover:text-blue-600"
                      }`}
                  >
                    {item.icon}
                    {item.name}
                  </li>
                );
              })}
            </ul>

            {/* Bottom Menu */}
            <ul className="space-y-2 text-gray-700 font-medium">
              {bottomMenuItems.map((item) => {
                const isActive = pathname === item.path;
                const isLogout = item.name === "Logout";

                return (
                  <li
                    key={item.name}
                    onClick={() =>
                      isLogout
                        ? item.action()
                        : router.push(item.path)
                    }
                    className={`flex items-center gap-3 cursor-pointer rounded-xl py-2.5 px-3 transition-colors ${isLogout
                      ? "text-red-500 hover:text-red-700 hover:bg-red-100"
                      : isActive
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "hover:bg-gray-100 hover:text-blue-600"
                      }`}
                  >
                    {item.icon}
                    {item.name}
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Page Content */}
          <section className="flex-1 ml-72 overflow-y-auto h-[calc(100vh-80px)]">
            {children}
          </section>
        </main>
      </div>
    </SessionProvider>
  );
};

export default layout;