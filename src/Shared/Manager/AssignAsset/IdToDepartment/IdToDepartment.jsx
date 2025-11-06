// React components
import React, { useEffect } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAxiosPublic from "@/Hooks/useAxiosPublic";

const IdToDepartment = ({ id, onDepartmentFetched }) => {
  const axiosPublic = useAxiosPublic();

  // No department assigned
  if (!id) {
    return <div className="text-gray-400 italic text-sm text-center">Not Set</div>;
  }

  // Fetch department info
  const {
    data: DepartmentData,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["DepartmentData", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/Departments/${id}`);
      return res?.data?.department ?? null;
    },
    enabled: !!id,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  // Notify parent with department info
  useEffect(() => {
    if (DepartmentData) {
      onDepartmentFetched?.({
        _id: DepartmentData._id,
        department_Name: DepartmentData.department_Name,
        department_Code: DepartmentData.department_Code,
      });
    }
  }, [DepartmentData, onDepartmentFetched]);

  // Loading placeholder
  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center gap-2 animate-pulse">
        <div className="w-4 h-4 rounded-full bg-gray-300"></div>
        <div className="w-24 h-3 rounded bg-gray-300"></div>
      </div>
    );
  }

  // Not found or error
  if (error || !DepartmentData) {
    return <div className="text-red-500 text-sm font-medium text-center">Not Found</div>;
  }

  // Valid department
  return (
    <div className="flex flex-col items-center justify-center text-sm font-medium text-gray-700">
      <span>{DepartmentData.department_Name}</span>
      <span className="text-xs text-gray-500">{DepartmentData.department_Code}</span>
    </div>
  );
};

export default IdToDepartment;