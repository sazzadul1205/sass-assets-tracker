// src/app/Employee/MyRequests/page.jsx
"use client";

// React components
import React from "react";

// Next Auth
import { useSession } from "next-auth/react";

// Icons
import { MdOutlineAssignment } from "react-icons/md";

// Packages
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAxiosPublic from "@/Hooks/useAxiosPublic";

// Shared
import Error from "@/Shared/Error/Error";
import Loading from "@/Shared/Loading/Loading";

// Modals
import SharedHeader from "@/Shared/SharedHeader/SharedHeader";

const Page = () => {
  const axiosPublic = useAxiosPublic();
  const { data: session, status } = useSession();

  // Fetch User Asset Services Data
  const {
    data: UserAssetServicesData,
    error: UserAssetServicesError,
    refetch: UserAssetServicesRefetch,
    isLoading: UserAssetServicesIsLoading,
  } = useQuery({
    queryKey: ["UserAssetServicesData", session?.user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/AssetServices/${session?.user?.email}`)
        .then((res) => res?.data?.data),
    enabled: !!session?.user?.email,
  });

  // After data is fetched successfully
  const assetIDs = UserAssetServicesData?.map((item) => item.Asset) || [];
  console.log("assetIDs", assetIDs);

  // Fetch asset details using the IDs
  const {
    data: IdAssetsData,
    error: IdAssetsError,
    refetch: IdAssetsRefetch,
    isLoading: IdAssetsIsLoading,
  } = useQuery({
    queryKey: ["IdAssetsData", assetIDs],
    queryFn: () =>
      axiosPublic
        .get("/Assets/IdArray", {
          params: { ids: assetIDs }, // send array as query param
        })
        .then((res) => res.data?.data),
    enabled: !!assetIDs?.length,
  });


  // Refetch
  const Refetch = () => {
    IdAssetsRefetch();
    UserAssetServicesRefetch();
  };

  // Loading state
  if (
    IdAssetsIsLoading ||
    status === "loading" ||
    UserAssetServicesIsLoading
  ) return <Loading />;

  // Error state
  if (
    IdAssetsError ||
    UserAssetServicesError
  ) {
    console.error("IdAssetsError :", IdAssetsError);
    console.error("UserAssetServicesError :", UserAssetServicesError);

    return <Error errors={[UserAssetServicesError, IdAssetsError]} />;
  }


  console.log(IdAssetsData);

  return (
    <div className="p-5">
      {/* Header Section */}
      <SharedHeader
        icon={<MdOutlineAssignment size={28} className="text-blue-600" />}
        title="My Requests"
        description="Manage & track all your requests in one place."
        tip="Tip: Click on a request card below to quickly filter and view related requests."
      />


    </div>
  );
};

export default Page;