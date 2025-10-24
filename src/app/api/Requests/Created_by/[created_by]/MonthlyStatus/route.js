// api/Requests/Created_by/[created_by]/MonthlyStatus/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";

export const GET = async (req, { params }) => {
  const { created_by } = params;

  if (!created_by) {
    return NextResponse.json(
      { success: false, message: "Missing 'created_by' parameter" },
      { status: 400 }
    );
  }

  // Parse query parameters for month and year
  const { searchParams } = new URL(req.url);
  const month =
    parseInt(searchParams.get("month")) || new Date().getMonth() + 1;
  const year = parseInt(searchParams.get("year")) || new Date().getFullYear();

  try {
    const db = await connectDB();

    // Compute start and end dates for the selected month
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59);

    // Fetch all requests for the user in this month
    const requests = await db
      .collection("Requests")
      .find({
        created_by,
        created_at: {
          $gte: monthStart.toISOString(),
          $lte: monthEnd.toISOString(),
        },
      })
      .toArray();

    // Define your official statuses
    const validStatuses = [
      "Pending",
      "Completed",
      "Rejected",
      "Canceled",
      "Accepted",
      "Working On",
    ];

    // Initialize monthly counts with 0
    const monthlyCounts = validStatuses.reduce(
      (acc, s) => {
        acc[s] = 0;
        return acc;
      },
      { Unmatched: 0 }
    );

    // Loop through requests and normalize statuses
    for (const req of requests) {
      let status = (req.status || "").trim().toLowerCase();

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

      if (status && validStatuses.includes(status)) monthlyCounts[status]++;
      else monthlyCounts.Unmatched++;
    }

    return NextResponse.json({
      success: true,
      month,
      year,
      monthlyCounts,
      message: "Monthly status counts fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching monthly status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch monthly status" },
      { status: 500 }
    );
  }
};
