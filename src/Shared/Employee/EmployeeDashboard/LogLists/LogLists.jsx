// Icons
import { LuFileText, LuCheck, LuInfo } from "react-icons/lu";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Components
import ReceptData from "./ReceptData/ReceptData";

const LogLists = ({ logPage, setLogPage, LogStatusData }) => {
  if (!LogStatusData) return null;

  // Map actions to icons and colors
  const logTypeMap = {
    "Created a receipt": {
      icon: <LuFileText className="text-blue-600" />,
      bg: "bg-blue-50 hover:bg-blue-100",
      border: "border-l-4 border-blue-300",
    },
    "Status updated": {
      icon: <LuCheck className="text-green-600" />,
      bg: "bg-green-50 hover:bg-green-100",
      border: "border-l-4 border-green-300",
    },
    default: {
      icon: <LuInfo className="text-gray-400" />,
      bg: "bg-gray-50 hover:bg-gray-100",
      border: "border-l-4 border-gray-300",
    },
  };

  // Render pagination
  const renderPagination = () => (
    <div className="flex justify-center my-4">
      <div className="join">
        {/* Pagination buttons left */}
        <button
          className="join-item btn btn-sm bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900"
          onClick={() => setLogPage((prev) => Math.max(prev - 1, 1))}
          disabled={logPage === 1}
        >
          <FaChevronLeft />
        </button>

        {/* Pagination buttons */}
        {Array.from({ length: LogStatusData.pagination.totalPages }, (_, i) => (
          <button
            key={i}
            className={`join-item btn btn-sm ${logPage === i + 1
              ? "bg-blue-300 text-white"
              : "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
              }`}
            onClick={() => setLogPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        {/* Pagination buttons right */}
        <button
          className="join-item btn btn-sm bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900"
          onClick={() =>
            setLogPage((prev) => Math.min(prev + 1, LogStatusData.pagination.totalPages))
          }
          disabled={logPage === LogStatusData.pagination.totalPages}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );

  return (
    <div className="mt-10">

      {/* Title */}
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Recent Logs</h3>

      {/* Pagination Top */}
      {LogStatusData?.pagination?.totalPages > 1 && renderPagination()}

      {/* Render logs */}
      {LogStatusData?.data?.length > 0 ? (
        <div className="space-y-3">
          {LogStatusData.data.map((log) => {
            const type =
              log.action.includes("Created a receipt")
                ? "Created a receipt"
                : log.action.includes("Status updated")
                  ? "Status updated"
                  : "default";

            const { icon, bg, border } = logTypeMap[type];

            return (
              <div
                key={log._id}
                className={`p-4 ${bg} ${border} rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center transition-all duration-200`}
              >
                {/* Left: Icon + Action */}
                <div className="flex items-center gap-3">

                  {/* Icon */}
                  <div className="text-2xl">{icon}</div>

                  {/* Action and details */}
                  <div>
                    {/* Action */}
                    <span className="font-medium text-gray-700">{log.action}</span>

                    {/* Details */}
                    <div className="text-gray-500 text-sm mt-0.5">

                      {/* Receipt ID */}
                      {log.details?.receipt_id && (
                        <>
                          <ReceptData receipt_id={log?.details?.receipt_id} />
                        </>
                      )}

                      {/* Request */}
                      {log.details?.request_title && (
                        <>
                          Request:{" "}
                          <span className="font-semibold">{log.details.request_title}</span>, From{" "}
                          <span className="font-semibold">{log.details.previous_status}</span> →{" "}
                          <span className="font-semibold">{log.details.new_status}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Timestamp */}
                <span className="text-gray-400 text-xs mt-2 sm:mt-0 sm:text-sm">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
          {/* Icon */}
          <svg
            className="w-12 h-12 text-blue-300 mb-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17v-4h6v4m2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h3l2-2 2 2h3a2 2 0 012 2v10a2 2 0 01-2 2z"
            ></path>
          </svg>

          {/* Text */}
          <p className="text-gray-600 font-medium text-lg">No logs found</p>

          {/* Description */}
          <p className="text-gray-400 text-sm mt-1">You don’t have any logs yet. Actions will appear here.</p>
        </div>

      )}

      {/* Pagination Bottom */}
      {LogStatusData?.pagination?.totalPages > 1 && renderPagination()}
    </div>
  );
};

export default LogLists;
