"use client";

// React components
import React from "react";

// Next.js components
import { useRouter } from "next/navigation";

// Icons
import { HiOutlineExclamationCircle } from "react-icons/hi";

const Error = ({ message }) => {

    // Next.js hooks
    const router = useRouter();

    // Default error message
    const defaultMessage = "Oops! Something went wrong. Please try again later.";

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-100 via-red-50 to-red-100 p-6 text-center">
            {/* Error Icon */}
            <HiOutlineExclamationCircle className="text-red-600 w-32 h-32 mb-6 animate-bounce-slow" />

            {/* Error Text */}
            <h1 className="text-3xl md:text-4xl font-bold text-red-700 mb-2">Error</h1>
            <p className="text-gray-700 mb-6 max-w-md">{message || defaultMessage}</p>

            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="px-6 py-2 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition-colors shadow-lg"
            >
                Go Back
            </button>

            {/* Animation */}
            <style jsx>{`
             @keyframes bounce-slow {
               0%, 100% {
                 transform: translateY(0);
               }
               50% {
                 transform: translateY(-15px);
               }
             }
             .animate-bounce-slow {
               animation: bounce-slow 1.5s infinite;
             }
            `}</style>
        </div>
    );
};

export default Error;
