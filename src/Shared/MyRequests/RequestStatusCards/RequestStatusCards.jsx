import { FaClock, FaCheckCircle, FaTimesCircle, FaBan, FaThumbsUp, FaSpinner } from "react-icons/fa";

const RequestStatusCards = ({
  selectedStatus,
  setSelectedStatus,
  RequestsStatusData,
}) => {
  // Destructure data
  const counts = RequestsStatusData?.statusCounts || {};

  // Handle click
  const handleClick = (title) => {
    setSelectedStatus(selectedStatus === title ? "all" : title);
  };

  // Statuses array
  const statuses = [
    { title: "Pending", subtitle: "Requests waiting for approval", count: counts.Pending || 0, icon: <FaClock />, color: "yellow" },
    { title: "Completed", subtitle: "Requests successfully completed", count: counts.Completed || 0, icon: <FaCheckCircle />, color: "green" },
    { title: "Rejected", subtitle: "Requests that were rejected", count: counts.Rejected || 0, icon: <FaTimesCircle />, color: "red" },
    { title: "Cancelled", subtitle: "Requests that were cancelled", count: counts.Canceled || 0, icon: <FaBan />, color: "gray" },
    { title: "Accepted", subtitle: "Requests that are accepted", count: counts.Accepted || 0, icon: <FaThumbsUp />, color: "blue" },
    { title: "Work In Progress", subtitle: "Requests currently in progress", count: counts["Working On"] || 0, icon: <FaSpinner className="animate-spin" />, color: "indigo" },
  ];

  // Color Classes
  const colorClasses = {
    yellow: "text-yellow-500",
    green: "text-green-500",
    red: "text-red-500",
    gray: "text-gray-500",
    blue: "text-blue-500",
    indigo: "text-indigo-500",
  };

  // Background Classes
  const bgClasses = {
    yellow: "bg-yellow-100",
    green: "bg-green-100",
    red: "bg-red-100",
    gray: "bg-gray-100",
    blue: "bg-blue-100",
    indigo: "bg-indigo-100",
  };

  // Border Classes
  const borderClasses = {
    yellow: "border-yellow-500",
    green: "border-green-500",
    red: "border-red-500",
    gray: "border-gray-500",
    blue: "border-blue-500",
    indigo: "border-indigo-500",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-black pt-5">
      {statuses.map((status) => {
        // Check if status is selected
        const isSelected = selectedStatus === status.title;

        return (
          <div
            key={status.title}
            onClick={() => handleClick(status.title)}
            className={`flex items-center p-4 rounded-lg transition-all cursor-pointer shadow hover:shadow-lg
              ${isSelected ? `${bgClasses[status.color]} border-2 ${borderClasses[status.color]} shadow-xl` : "bg-white border-2 border-transparent"}
            `}
          >
            {/* Icon */}
            <div className={`p-3 rounded-full text-5xl mr-4 ${colorClasses[status.color]}`}>{status.icon}</div>

            {/* Content */}
            <div>
              {/* Title */}
              <h3 className="text-lg font-semibold">{status.title}</h3>

              {/* Subtitle */}
              <p className="text-sm text-gray-500">{status.subtitle}</p>

              {/* Count */}
              <span className="text-xl font-bold mt-1 block">{status.count}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RequestStatusCards;
