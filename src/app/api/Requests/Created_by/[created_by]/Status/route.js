// api/Requests/Created_by/[created_by]/Status/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";

export const GET = async (req, context) => {
  try {
    // Await params
    const { params } = context;
    const created_by = params?.created_by;

    if (!created_by) {
      return NextResponse.json(
        { success: false, message: "Missing 'created_by' parameter" },
        { status: 400 }
      );
    }

    const db = await connectDB();

    // Fetch all requests for this user
    const requests = await db
      .collection("Requests")
      .find({ created_by })
      .toArray();

    // Define official app statuses
    const validStatuses = [
      "Pending",
      "Completed",
      "Rejected",
      "Canceled",
      "Accepted",
      "Working On",
    ];

    // Initialize all counts
    const statusCounts = validStatuses.reduce(
      (acc, s) => {
        acc[s] = 0;
        return acc;
      },
      { Unmatched: 0 }
    );

    // Normalize and count statuses
    for (const req of requests) {
      let status = (req.status || "").trim().toLowerCase();

      // Normalize status
      if (["cancelled", "canceled"].includes(status)) status = "Canceled";
      else if (["working on", "in progress", "ongoing"].includes(status))
        status = "Working On";
      else if (["done", "completed", "finished"].includes(status))
        status = "Completed";
      else if (["pending", "awaiting", "waiting"].includes(status))
        status = "Pending";
      else if (["rejected", "declined"].includes(status)) status = "Rejected";
      else if (["accepted", "approved"].includes(status)) status = "Accepted";
      else status = null;

      // If the status is valid, increment its count
      if (status && validStatuses.includes(status)) {
        statusCounts[status]++;
      } else {
        statusCounts.Unmatched++;
      }
    }

    // Return the status counts
    return NextResponse.json({
      success: true,
      message: "Status counts fetched successfully",
      statusCounts,
    });

    // Return the status counts
  } catch (error) {
    // Log the error
    console.error("Error fetching status data:", error);
    // Return an error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch status counts",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
