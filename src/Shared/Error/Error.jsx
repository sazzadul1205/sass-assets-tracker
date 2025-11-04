"use client";

// React components
import React from "react";

// Next.js components
import { useRouter } from "next/navigation";

// Icons
import { HiOutlineExclamationCircle } from "react-icons/hi";

/**
 * Extract a user-friendly error message from any error object/string
 */
const extractErrorMessage = (error) => {
  if (!error) return null;

  if (typeof error === "string") return error;

  if (error?.response?.data?.message) return error.response.data.message;

  if (error?.message) return error.message;

  return null;
};

/**
 * Error Component
 * Accepts single or multiple errors dynamically
 * Usage: <Error errors={[error1, error2]} /> or <Error errors={error} />
 */
const Error = ({ errors }) => {
  const router = useRouter();

  // Ensure errors is always an array
  const errorArray = Array.isArray(errors) ? errors : [errors];

  // Extract messages
  const messages = errorArray
    .map(extractErrorMessage)
    .filter(Boolean);

  // Fallback message
  const defaultMessage = "Oops! Something went wrong. Please try again later.";

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-100 via-red-50 to-red-100 p-6 text-center">
      {/* Error Icon */}
      <HiOutlineExclamationCircle className="text-red-600 w-32 h-32 mb-6 animate-bounce-slow" />

      {/* Error Text */}
      <h1 className="text-3xl md:text-4xl font-bold text-red-700 mb-2">Error</h1>

      {/* Display all messages */}
      {messages.length > 0 ? (
        messages.map((msg, idx) => (
          <p key={idx} className="text-gray-700 mb-2 max-w-md">
            {msg}
          </p>
        ))
      ) : (
        <p className="text-gray-700 mb-6 max-w-md">{defaultMessage}</p>
      )}

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="px-6 py-2 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition-colors shadow-lg mt-4"
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
