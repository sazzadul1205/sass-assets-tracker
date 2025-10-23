import { FaClock, FaCheckCircle, FaTimesCircle, FaBan, FaThumbsUp, FaSpinner } from "react-icons/fa";

const RequestStatusCards = ({ data }) => {
  // Example data structure
  const statuses = [
    { title: "Pending", subtitle: "Requests waiting for approval", count: data.pending, icon: <FaClock className="text-yellow-500" /> },
    { title: "Completed", subtitle: "Requests successfully completed", count: data.completed, icon: <FaCheckCircle className="text-green-500" /> },
    { title: "Rejected", subtitle: "Requests that were rejected", count: data.rejected, icon: <FaTimesCircle className="text-red-500" /> },
    { title: "Cancelled", subtitle: "Requests that were cancelled", count: data.cancelled, icon: <FaBan className="text-gray-500" /> },
    { title: "Accepted", subtitle: "Requests that are accepted", count: data.accepted, icon: <FaThumbsUp className="text-blue-500" /> },
    { title: "Work In Progress", subtitle: "Requests currently in progress", count: data.inProgress, icon: <FaSpinner className="text-indigo-500 animate-spin" /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-black pt-5">
      {statuses.map((status) => (
        <div key={status.title} className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-xl transition-shadow cursor-default">
          {/* Icon */}
          <div className="p-3 rounded-full text-5xl  mr-4">
            {status.icon}
          </div>

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
      ))}
    </div>
  );
};

export default RequestStatusCards;
