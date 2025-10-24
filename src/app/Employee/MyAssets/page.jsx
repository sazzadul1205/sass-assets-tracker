// src/app/Employee/MyAssets/page.jsx
"use client";

import useAxiosPublic from '@/Hooks/useAxiosPublic';
import Error from '@/Shared/Error/Error';
import Loading from '@/Shared/Loading/Loading';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React from 'react';

const page = () => {
    const axiosPublic = useAxiosPublic();
    const { data: session, status } = useSession();

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
                .get(`/Requests/Created_by/${session?.user?.email}`)
                .then((res) => res.data.requests),
        enabled: !!session?.user?.email,
        keepPreviousData: true,
    });


    // Loading Handler
    if (RequestsIsLoading || status === "loading") return <Loading />;

    // Error Handler
    if (RequestsError) {
        const activeError = RequestsError;
        const errorMessage =
            typeof activeError === "string"
                ? activeError
                : activeError?.response?.data?.message ||
                activeError?.message ||
                "Something went wrong.";
        console.error("Error fetching requests or status:", activeError);
        return <Error message={errorMessage} />;
    }


    return (
        <div>

        </div>
    );
};

export default page;