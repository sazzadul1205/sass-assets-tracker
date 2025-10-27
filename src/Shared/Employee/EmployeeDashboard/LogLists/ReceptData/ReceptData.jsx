import React from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";

// Hooks
import useAxiosPublic from "@/Hooks/useAxiosPublic";

const ReceptData = ({ receipt_id }) => {
  const axiosPublic = useAxiosPublic();

  // ---------- Receipt Data Query ----------
  const {
    data: ReceptIdData,
    error: ReceptIdError,
    isLoading: ReceptIdIsLoading,
  } = useQuery({
    queryKey: ["ReceptIdData", receipt_id],
    queryFn: () =>
      axiosPublic.get(`/Receipts/${receipt_id}`).then((res) => res.data),
    enabled: !!receipt_id,
  });

  // ---------- Fallbacks ----------
  if (ReceptIdIsLoading) {
    return (
      <p className="flex items-center gap-2 text-blue-500 text-sm animate-pulse">
        <FaSpinner className="animate-spin" />
        Loading receipt info...
      </p>
    );
  }

  if (ReceptIdError || !ReceptIdData?.success) {
    return (
      <p className="flex items-center gap-2 text-red-500 text-sm">
        <FaExclamationTriangle />
        Failed to load receipt details
      </p>
    );
  }

  // ---------- Destructure safely ----------
  const { asset_name, asset_id, received_by } = ReceptIdData?.receipt || {};

  // ---------- Render Data ----------
  return (
    <div className="flex flex-wrap text-sm text-gray-600 gap-3">
      {asset_name && asset_name !== "N/A" && (
        <p>
          <span className="font-medium text-gray-800">Asset:</span> {asset_name}
        </p>
      )}

      {asset_id && asset_id !== "N/A" && (
        <p>
          <span className="font-medium text-gray-800">Asset ID:</span> {asset_id}
        </p>
      )}

      {received_by && received_by !== "N/A" && (
        <p>
          <span className="font-medium text-gray-800">Received By:</span> {received_by}
        </p>
      )}
    </div>
  );
};

export default ReceptData;
