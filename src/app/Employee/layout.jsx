// src/app/Employee/layout.jsx
"use client";

// Next Components
import { SessionProvider } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

// Icons
import { FaRegUser } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { LuUserRoundCheck } from "react-icons/lu";
import { IoReceiptOutline } from "react-icons/io5";
import { MdOutlineSpaceDashboard } from "react-icons/md";

// Shared
import EmployeeNavbar from "@/Shared/EmployeeNavbar/EmployeeNavbar";

export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // Top Menu Items
  const topMenuItems = [
    {
      name: "Dashboard",
      icon: <MdOutlineSpaceDashboard />,
      path: "/Employee/Dashboard",
    },
    {
      name: "My Assets",
      icon: <LuUserRoundCheck />,
      path: "/Employee/MyAssets",
    },
    {
      name: "My Requests",
      icon: <IoReceiptOutline />,
      path: "/Employee/MyRequests",
    },
  ];

  // Bottom Menu Items
  const bottomMenuItems = [
    {
      name: "Profile",
      icon: <FaRegUser />,
      path: "/Employee/Profile",
    },
    {
      name: "Logout",
      icon: <IoLogOutOutline />,
      path: "/logout",
    },
  ];

  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <EmployeeNavbar />

        {/* Main Layout */}
        <main className="flex">
          {/* Sidebar (Fixed) */}
          <aside
            className="w-72 fixed top-[65px] left-0 bottom-0 bg-white shadow-md p-4 border-r border-gray-200 
                     flex flex-col justify-between overflow-y-auto" style={{ height: "calc(100vh - 65px)" }}
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
                    onClick={() => router.push(item.path)}
                    className={`flex items-center gap-3 cursor-pointer rounded-xl py-2.5 px-3 transition-colors ${isLogout
                      ? `text-red-500 hover:text-red-700 hover:bg-red-100`
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

          {/* Page Content (Scrollable) */}
          <section className="flex-1 ml-72 overflow-y-auto h-[calc(100vh-80px)]">
            {children}
          </section>
        </main>
      </div>
    </SessionProvider>
  );
}
