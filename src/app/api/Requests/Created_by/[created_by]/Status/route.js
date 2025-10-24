// api/Requests/Created_by/[created_by]/Status/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";

export const GET = async (_req, { params }) => {
  const { created_by } = params;

  if (!created_by) {
    return NextResponse.json(
      { success: false, message: "Missing 'created_by' parameter" },
      { status: 400 }
    );
  }

  try {
    const db = await connectDB();

    // Fetch all requests for this user
    const requests = await db
      .collection("Requests")
      .find({ created_by })
      .toArray();

    // Define your official app statuses
    const validStatuses = [
      "Pending",
      "Completed",
      "Rejected",
      "Canceled",
      "Accepted",
      "Working On",
    ];

    // Initialize all counts with 0
    const statusCounts = validStatuses.reduce(
      (acc, s) => {
        acc[s] = 0;
        return acc;
      },
      { Unmatched: 0 }
    );

    // Loop and normalize statuses
    for (const req of requests) {
      let status = (req.status || "").trim().toLowerCase();

      // Normalize similar spellings / synonyms
      if (["cancelled", "canceled"].includes(status)) status = "Canceled";
      else if (["working on", "in progress", "ongoing"].includes(status))
        status = "Working On";
      else if (["done", "completed", "finished"].includes(status))
        status = "Completed";
      else if (["pending", "awaiting", "waiting"].includes(status))
        status = "Pending";
      else if (["rejected", "declined"].includes(status)) status = "Rejected";
      else if (["accepted", "approved"].includes(status)) status = "Accepted";
      else status = null; // mark as unknown

      // Count
      if (status && validStatuses.includes(status)) {
        statusCounts[status]++;
      } else {
        statusCounts.Unmatched++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Status counts fetched successfully",
      statusCounts,
    });
  } catch (error) {
    console.error("Error fetching status data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch status counts" },
      { status: 500 }
    );
  }
};
