// Next Components
import Image from "next/image";

// React components
import { useEffect } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAxiosPublic from "@/Hooks/useAxiosPublic";

// Assets
import DefaultUser from "../../../../../public/Placeholders/User.png";

const EmailToUserInfo = ({ email }) => {
  const axiosPublic = useAxiosPublic();

  // Fetch user data
  const {
    data: UserData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["UserData", email],
    queryFn: async () => {
      if (!email || !email.includes("@")) return null;

      const res = await axiosPublic.get(`/Users/${email}`);
      const user = res?.data?.user;
      return user ?? null;
    },
    enabled: !!email,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  // Auto refetch when email changes
  useEffect(() => {
    if (email) refetch();
  }, [email, refetch]);

  // Loading placeholder
  if (isLoading || isFetching) {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
        <div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // No data / not assigned
  if (!UserData) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
          <Image
            src={DefaultUser.src}
            alt="Default User"
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-gray-800">Not Assigner</h3>
          <p className="text-sm text-gray-500">{email || "Unknown Email"}</p>
        </div>
      </div>
    );
  }

  // Render valid user
  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <Image
          src={UserData?.profileImage ? UserData?.profileImage : "/Placeholders/User.png"}
          alt="User"
          width={100}
          height={100}
        />
      </div>

      {/* Info */}
      <div className="text-left">
        <h3 className="font-semibold text-gray-800">
          {UserData?.name || "Public User"}
        </h3>
        <p className="text-sm text-gray-500">{UserData?.email || email}</p>
      </div>
    </div>
  );
};

export default EmailToUserInfo;
