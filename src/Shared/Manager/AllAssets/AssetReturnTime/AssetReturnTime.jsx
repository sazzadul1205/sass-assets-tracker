import React from "react";

const AssetReturnTime = ({ isLimited, return_date }) => {
    // Handle not assigned
    if (isLimited === undefined || isLimited === null) {
        return <span className="text-gray-400 italic">Not Assigned</span>;
    }

    // Render indefinite duration
    if (!isLimited) {
        return <span className="text-green-600 font-medium">Indefinite Duration</span>;
    }

    // Render time left
    if (!return_date) {
        return <span className="text-gray-400 italic">No Return Date</span>;
    }

    // Calculate time left
    const now = new Date();
    const returnDate = new Date(return_date);
    const diffMs = returnDate - now;

    // Check if expired
    if (diffMs <= 0) {
        return <span className="text-red-500 font-medium">Expired</span>;
    }

    // Calculate time left
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    let timeLeft = "";
    if (diffYears >= 1) {
        timeLeft = `${diffYears} year${diffYears > 1 ? "s" : ""}${diffMonths % 12 > 0 ? `, ${diffMonths % 12} month${diffMonths % 12 > 1 ? "s" : ""}` : ""} left`;
    } else if (diffMonths >= 1) {
        timeLeft = `${diffMonths} month${diffMonths > 1 ? "s" : ""} left`;
    } else {
        timeLeft = `${diffDays} day${diffDays > 1 ? "s" : ""} left`;
    }

    return (
        <div className="flex flex-col items-center">
            <span className="font-medium text-gray-800">
                {returnDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
            <span className="text-xs text-gray-500">{timeLeft}</span>
        </div>
    );
};

export default AssetReturnTime;
