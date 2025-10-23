// Icons
import { FaClock, FaCheckCircle, FaTimesCircle, FaBan, FaThumbsUp, FaSpinner } from "react-icons/fa";

const RequestStatusCards = ({
  selectedStatus,
  setSelectedStatus,
  RequestsStatusData,
}) => {

  // Counts
  const counts = RequestsStatusData?.statusCounts || {};

  // Handle Click
  const handleClick = (title) => {
    // Toggle selection
    setSelectedStatus(selectedStatus === title ? null : title);
  };

  // Statuses with their display info and theme color
  const statuses = [
    { title: "Pending", subtitle: "Requests waiting for approval", count: counts.Pending || 0, icon: <FaClock />, color: "yellow" },
    { title: "Completed", subtitle: "Requests successfully completed", count: counts.Completed || 0, icon: <FaCheckCircle />, color: "green" },
    { title: "Rejected", subtitle: "Requests that were rejected", count: counts.Rejected || 0, icon: <FaTimesCircle />, color: "red" },
    { title: "Cancelled", subtitle: "Requests that were cancelled", count: counts.Canceled || 0, icon: <FaBan />, color: "gray" },
    { title: "Accepted", subtitle: "Requests that are accepted", count: counts.Accepted || 0, icon: <FaThumbsUp />, color: "blue" },
    { title: "Work In Progress", subtitle: "Requests currently in progress", count: counts["Working On"] || 0, icon: <FaSpinner className="animate-spin" />, color: "indigo" },
  ];

  // Tailwind-safe class map
  const colorMap = {
    yellow: "yellow",
    green: "green",
    red: "red",
    gray: "gray",
    blue: "blue",
    indigo: "indigo",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-black pt-5">
      {statuses.map((status) => {
        const isSelected = selectedStatus === status.title;

        // Tailwind-safe dynamic classes
        const bgColor = isSelected ? `bg-${colorMap[status.color]}-100` : "bg-white";
        const borderColor = isSelected ? `border-2 border-${colorMap[status.color]}-500` : "border-2 border-transparent";
        const shadow = isSelected ? "shadow-xl" : "shadow hover:shadow-lg";

        const iconColor = `text-${colorMap[status.color]}-500`;

        return (
          <div
            key={status.title}
            onClick={() => handleClick(status.title)}
            className={`flex items-center p-4 rounded-lg transition-all cursor-pointer ${bgColor} ${borderColor} ${shadow}`}
          >
            {/* Icon */}
            <div className={`p-3 rounded-full text-5xl mr-4 ${iconColor}`}>{status.icon}</div>

            {/* Content */}
            <div>
              <h3 className="text-lg font-semibold">{status.title}</h3>
              <p className="text-sm text-gray-500">{status.subtitle}</p>
              <span className="text-xl font-bold mt-1 block">{status.count}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RequestStatusCards;
