// src/Shared/EmployeeNavbar/EmployeeNavbar.jsx
"use client";

// Next Components
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Assets
import Logo from "../../../../public/Auth_Assets/SAT_Logo.png";

const EmployeeNavbar = () => {
  const pathname = usePathname();

  // Derive the active page name from the path
  const getPageTitle = () => {
    if (pathname.includes("Dashboard")) return "Employee Dashboard";
    if (pathname.includes("MyAssets")) return "Employee Assets";
    if (pathname.includes("MyRequests")) return "Employee Requests";
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
        <div className="avatar">
          <div className="w-12 rounded-full">
            <img
              src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
              alt="Profile"
            />
          </div>
        </div>
        <h3 className="font-semibold">John Doe</h3>
      </div>
    </div>
  );
};

export default EmployeeNavbar;
