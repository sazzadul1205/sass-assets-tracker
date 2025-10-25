// src/app/Employee/AssetRecept/page.jsx
"use client";

// React components
import { useState } from 'react';

// Next components
import { useSession } from 'next-auth/react';

// Packages
import { useQuery } from '@tanstack/react-query';

// Icons
import { FaEye, FaFileInvoiceDollar, FaBoxOpen } from "react-icons/fa";

// Hooks
import useAxiosPublic from '@/Hooks/useAxiosPublic';

// Shared
import Loading from '@/Shared/Loading/Loading';
import Error from '@/Shared/Error/Error';

// Modals
import ViewRequestModal from '@/Shared/MyAssets/ViewRequestModal/ViewRequestModal';
import ViewReceiptModal from '@/Shared/AssetRecept/ViewReceiptModal/ViewReceiptModal';
import GenerateReceiptModal from '@/Shared/AssetRecept/GenerateReceiptModal/GenerateReceiptModal';

// Map priorities to styles
const priorityStyles = {
  Urgent: "text-red-700 font-medium",
  High: "text-orange-600 font-medium",
  Medium: "text-yellow-600 font-medium",
  Low: "text-green-600 font-medium",
};

const page = () => {
  const axiosPublic = useAxiosPublic();
  const { data: session, status } = useSession();

  // Select State
  const [selectedAsset, setSelectedAsset] = useState(null);

  // ---------- Requests Query ----------
  const {
    data: RequestsData,
    error: RequestsError,
    refetch: RequestsRefetch,
    isLoading: RequestsIsLoading,
  } = useQuery({
    queryKey: ["RequestsData", session?.user?.email,],
    queryFn: () =>
      axiosPublic
        .get(`/Requests/Created_by/${session?.user?.email}/Completed`)
        .then((res) => res.data.requests),
    enabled: !!session?.user?.email,
    keepPreviousData: true,
  });

  // Assuming RequestsData is your array
  const requestIds = RequestsData?.map(request => request._id) || [];

  // ---------- Receipts Query ----------
  const {
    data: ReceiptsData,
    error: ReceiptsError,
    refetch: ReceiptsRefetch,
    isLoading: ReceiptsIsLoading,
  } = useQuery({
    queryKey: ["ReceiptsData", requestIds],
    queryFn: async () => {
      if (!requestIds || requestIds.length === 0) return [];

      const idsQuery = requestIds.join(",");
      const res = await axiosPublic.get(`/Receipts/MultiFetch?request_ids=${idsQuery}`);
      return res.data.data;
    },
    enabled: !!session?.user?.email && requestIds?.length > 0,
    keepPreviousData: true,
  });

  // ---------- Users Data Query ----------
  const {
    data: UserData,
    isLoading: UserIsLoading,
    refetch: UserRefetch,
    error: UserError,
  } = useQuery({
    queryKey: ["UserData", session?.user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Users/${session?.user?.email}`)
        .then((res) => res.data.user),
    enabled: !!session?.user?.email,
  });


  // Safe receipts map
  const receiptsMap = (ReceiptsData || []).reduce((acc, receipt) => {
    acc[receipt.request_id] = receipt;
    return acc;
  }, {});

  // Merge receipts into requests safely
  const mergedData = (RequestsData || []).map(request => {
    return {
      ...request,
      receipt: receiptsMap[request._id] || null
    };
  });

  // Loading Handler
  if (
    UserIsLoading ||
    RequestsIsLoading ||
    ReceiptsIsLoading ||
    status === "loading"
  ) return <Loading />;

  // Error Handler
  if (RequestsError || ReceiptsError || UserError) {
    const activeError = RequestsError || ReceiptsError || UserError;
    const errorMessage =
      typeof activeError === "string"
        ? activeError
        : activeError?.response?.data?.message ||
        activeError?.message ||
        "Something went wrong.";
    console.error("Error fetching requests or status:", activeError);
    return <Error message={errorMessage} />;
  }

  // Refetch Handler
  const RefetchAll = () => {
    UserRefetch();
    RequestsRefetch();
    ReceiptsRefetch();
  };

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 flex items-center gap-2">
            <FaFileInvoiceDollar size={30} className="text-blue-600" />
            Asset Receipt
          </h1>

          <p className="mt-1 text-gray-600 text-sm sm:text-base">
            Review and confirm received assets with all related details.
          </p>

          <p className="mt-2 text-xs sm:text-sm text-gray-400 italic">
            Tip: Double-check asset ID and condition before confirmation.
          </p>
        </div>
      </div>


      {/* Completed Requests Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          {/* Table Header */}
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">#</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Asset Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Category</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Requester</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Request Type</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Priority</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {mergedData && mergedData.length > 0 ? (
              mergedData.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  {/* Index */}
                  <td className="px-5 py-3 font-medium text-gray-900">
                    {index + 1} .
                  </td>

                  {/* Asset Name */}
                  <td className="px-4 py-3 text-gray-700 cursor-default">{item.asset_name}</td>

                  {/* Asset Category */}
                  <td className="px-4 py-3 text-gray-700 cursor-default">{item.asset_category}</td>

                  {/* Requester Name */}
                  <td className="px-4 py-3 text-gray-700 cursor-default">{item.requester_name}</td>

                  {/* Request Type */}
                  <td className="px-4 py-3 text-gray-700 cursor-default">{item.request_type}</td>

                  {/* Priority */}
                  <td className="px-4 py-3 text-center cursor-default">
                    <span className={priorityStyles[item.priority] || "text-gray-600 font-medium"}>
                      {item.priority}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-5 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      {/* View Request Button */}
                      <button
                        onClick={() => {
                          setSelectedAsset(item);
                          document.getElementById("View_Request_Modal").showModal();
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
                      >
                        <FaEye size={16} />
                        View
                      </button>

                      {/* Generate or View Receipt Button */}
                      {item.receipt ? (
                        <button
                          onClick={() => {
                            setSelectedAsset(item);
                            document.getElementById("View_Receipt_Modal").showModal();
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 active:scale-95 transition-all"
                        >
                          <FaEye size={16} />
                          View Receipt
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedAsset(item);
                            document.getElementById("Generate_Receipt_Modal").showModal();
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 active:scale-95 transition-all"
                        >
                          <FaFileInvoiceDollar size={16} />
                          Generate
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-6 text-center text-gray-500 flex flex-col items-center justify-center"
                >
                  <FaBoxOpen className="text-3xl text-gray-400 mb-2" />
                  No completed asset receipts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create New Request Modal */}
      <dialog id="View_Request_Modal" className="modal">
        <ViewRequestModal
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Create New Request Modal */}
      <dialog id="Generate_Receipt_Modal" className="modal">
        <GenerateReceiptModal
          refetch={RefetchAll}
          sessionData={session}
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Create New Request Modal */}
      <dialog id="View_Receipt_Modal" className="modal">
        <ViewReceiptModal
          UserData={UserData}
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default page;