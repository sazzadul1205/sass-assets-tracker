// api/Requests/Created_by/[created_by]/MonthlyStatus/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";

export const GET = async (req, { params }) => {
  // Destructure params
  const { created_by } = params;

  // Parse query parameters for month and year, default to current month/year
  const { searchParams } = new URL(req.url);
  const month =
    parseInt(searchParams.get("month")) || new Date().getMonth() + 1;
  const year = parseInt(searchParams.get("year")) || new Date().getFullYear();

  // Validate created_by
  if (!created_by) {
    return NextResponse.json(
      { success: false, message: "Missing 'created_by' parameter" },
      { status: 400 }
    );
  }

  try {
    // Connect to MongoDB
    const db = await connectDB();

    // Compute start and end dates for the selected month
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59);

    // Aggregate requests by status within the month
    const pipeline = [
      {
        $match: {
          created_by,
          created_at: {
            $gte: monthStart.toISOString(),
            $lte: monthEnd.toISOString(),
          },
        },
      },
      {
        $group: { _id: "$status", count: { $sum: 1 } },
      },
    ];

    // Execute aggregation
    const results = await db
      .collection("Requests")
      .aggregate(pipeline)
      .toArray();

    // Convert aggregation array to simple object
    const monthlyCounts = results.reduce((acc, cur) => {
      acc[cur._id] = cur.count;
      return acc;
    }, {});

    // Return response
    return NextResponse.json({
      success: true,
      month,
      year,
      monthlyCounts,
      message: "Monthly status counts fetched successfully",
    });
  } catch (error) {
    // Handle error
    console.error("Error fetching monthly status:", error);

    // Return error response
    return NextResponse.json(
      { success: false, message: "Failed to fetch monthly status" },
      { status: 500 }
    );
  }
};
