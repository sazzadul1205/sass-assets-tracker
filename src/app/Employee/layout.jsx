// src/app/Employee/layout.jsx

"use client";

import { usePathname, useRouter } from "next/navigation";

// Icons
import { LuUserRoundCheck } from "react-icons/lu";
import { IoReceiptOutline } from "react-icons/io5";
import { MdOutlineSpaceDashboard } from "react-icons/md";

// Shared
import EmployeeNavbar from "@/Shared/EmployeeNavbar/EmployeeNavbar";

export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <EmployeeNavbar />

      {/* Main Content */}
      <main className="flex">
        {/* Sidebar */}
        <aside className="w-72 min-h-screen bg-white shadow-md p-3 border-r border-gray-200 pt-5 ">
          <ul className="space-y-2 text-gray-700 font-medium">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;

              return (
                <li
                  key={item.name}
                  onClick={() => router.push(item.path)}
                  className={`flex items-center gap-2 cursor-pointer rounded-2xl py-2 px-3 transition-colors
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
        </aside>

        {/* Page Content */}
        <section className="flex-1 p-6">{children}</section>
      </main>
    </div>
  );
}
