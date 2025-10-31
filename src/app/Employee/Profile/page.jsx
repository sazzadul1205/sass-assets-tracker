// src/app/Employee/Profile/page.jsx
"use client";

// Next Auth
import { useSession } from "next-auth/react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { CiLock } from "react-icons/ci";
import {
  FaCity,
  FaPhone,
  FaGlobe,
  FaClock,
  FaSyncAlt,
  FaIdBadge,
  FaEnvelope,
  FaUsersCog,
  FaBuilding,
  FaUserCircle,
  FaCalendarAlt,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaBirthdayCake
} from "react-icons/fa";

// Hooks
import useAxiosPublic from "@/Hooks/useAxiosPublic";

// Shared
import Error from "@/Shared/Error/Error";
import Loading from "@/Shared/Loading/Loading";

// Modals
import UpdatedUserDataModal from "@/Shared/Employee/Profile/UpdatedUserDataModal/UpdatedUserDataModal";
import UpdatedUserPasswordModal from "@/Shared/Employee/Profile/UpdatedUserPasswordModal/UpdatedUserPasswordModal";

const ProfilePage = () => {
  const axiosPublic = useAxiosPublic();
  const { data: session, status } = useSession();

  // ----------- User Data Query -----------
  const {
    data,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["UserData", session?.user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Users/${session?.user?.email}`)
        .then((res) => res.data.user),
    enabled: !!session?.user?.email,
  });

  // Loading Handler
  if (
    isLoading ||
    status === "loading"
  ) return <Loading />;

  // Error Handler
  if (error) {
    const activeError = error;
    const errorMessage =
      typeof activeError === "string"
        ? activeError
        : activeError?.response?.data?.message ||
        activeError?.message ||
        "Something went wrong.";
    console.error("Error fetching requests or status:", activeError);
    return <Error message={errorMessage} />;
  }

  // Date Formatter
  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("en-US") : "Not Provided";


  return (
    <div className="p-6 space-y-6 text-gray-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        {/* Header Content */}
        <div>
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold flex items-center gap-2 text-gray-800">
            <FaUserCircle size={36} className="text-blue-600" />
            My Profile
          </h1>

          {/* Description */}
          <p className="mt-1 text-gray-600 text-sm sm:text-base">
            View your account information and professional details.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4 sm:mt-0">
          {/* Edit Profile Button */}
          <button
            onClick={() => document.getElementById("Updated_User_Data_Modal").showModal()}
            className="flex items-center gap-3 px-15 py-2.5 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:shadow-xl 
            hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            Edit Profile
          </button>

          {/* Change Password Button */}
          <button
            onClick={() => document.getElementById("Updated_User_Password_Modal").showModal()}
            className="flex items-center gap-3 px-5 py-2.5 bg-white text-gray-800 rounded-lg font-semibold border border-gray-200 
            shadow-md hover:shadow-xl hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:text-blue-600transition-all 
            duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            <CiLock size={23} className="transition-colors duration-300 group-hover:text-blue-600" />
            Change Password
          </button>

        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" >
        {/* Basic Info Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
          {/* Header */}
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <FaIdBadge className="text-blue-600" /> Basic Information
          </h2>

          {/* User ID, Full Name, Email, and Date of Birth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow icon={<FaUserCircle />} label="User ID" value={data._id || "N/A"} />
            <InfoRow icon={<FaUserCircle />} label="Full Name" value={data.name || "Not Provided"} />
            <InfoRow icon={<FaEnvelope />} label="Email" value={data.email || "Not Provided"} />
            <InfoRow icon={<FaBirthdayCake />} label="Date of Birth" value={formatDate(data.dob)} />
          </div>
        </div>

        {/* Address Details Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
          {/* Header */}
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-600" /> Address Details
          </h2>

          {/* Address, City, Country, and Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow icon={<FaMapMarkerAlt />} label="Address" value={data.address || "Not Provided"} />
            <InfoRow icon={<FaCity />} label="City" value={data.city || "Not Provided"} />
            <InfoRow icon={<FaGlobe />} label="Country" value={data.country || "Not Provided"} />
            <InfoRow icon={<FaPhone />} label="Phone Number" value={data.phone || "Not Provided"} />
          </div>
        </div>

        {/* Work Information Card */}
        <div className="col-span-2 bg-white shadow-md rounded-2xl p-6 border border-gray-100">
          {/* Header */}
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <FaBuilding className="text-blue-600" /> Work Information
          </h2>

          {/* Organization, Designation, Department, Position, and Hire Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow icon={<FaBuilding />} label="Organization" value={data?.organization_name || "Not Provided"} />
            <InfoRow icon={<FaIdBadge />} label="Designation" value={data?.designation_name || "Not Provided"} />
            <InfoRow icon={<FaUsersCog />} label="Department" value={data?.department_name || "Not Provided"} />
            <InfoRow icon={<FaClock />} label="Position" value={data?.position_name || "Not Provided"} />
            <InfoRow icon={<FaCalendarAlt />} label="Hire Time" value={data?.hire_time || "Not Provided"} />
          </div>
        </div>

        {/* Account Metadata Card */}
        <div className="col-span-2 bg-white shadow-md rounded-2xl p-6 border border-gray-100">
          {/* Header */}
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <FaSyncAlt className="text-blue-600" /> Account Metadata
          </h2>

          {/* Created At, Updated At, and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoRow icon={<FaCalendarAlt />} label="Created At" value={formatDate(data.createdAt)} />
            <InfoRow icon={<FaCalendarAlt />} label="Updated At" value={formatDate(data.updatedAt)} />
            <InfoRow
              icon={<FaCheckCircle />}
              label="Status"
              value={
                <span className="flex items-center gap-2 text-green-600 font-semibold">
                  <FaCheckCircle /> Active
                </span>
              }
            />
          </div>
        </div>
      </div>

      {/* Updated User Data Modal */}
      <dialog id="Updated_User_Data_Modal" className="modal">
        <UpdatedUserDataModal
          Refetch={refetch}
          UserData={data}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Updated User Password Modal */}
      <dialog id="Updated_User_Password_Modal" className="modal">
        <UpdatedUserPasswordModal
          Refetch={refetch}
          UserData={data}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

// Reusable Row Component
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition">
    {/* Icon */}
    <div className="text-blue-600 text-lg">{icon}</div>

    {/* Label and Value */}
    <div>
      {/* Label */}
      <p className="text-sm text-gray-500 font-medium">{label}</p>

      {/* Value */}
      <p className="text-base font-semibold text-gray-800">
        {value || "Not Provided"}
      </p>
    </div>
  </div>
);

export default ProfilePage;
