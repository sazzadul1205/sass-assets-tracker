// api/Requests/Created_by/[created_by]/Status/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";

export const GET = async (req, { params }) => {
  const { created_by } = params;

  // Validate required parameter
  if (!created_by) {
    return NextResponse.json(
      { success: false, message: "Missing 'created_by' parameter" },
      { status: 400 }
    );
  }

  try {
    // Connect to database
    const db = await connectDB();

    // Aggregate requests by their status
    const pipeline = [
      { $match: { created_by } },
      {
        $group: {
          _id: "$status", // group by status
          count: { $sum: 1 }, // count how many per status
        },
      },
    ];

    const results = await db
      .collection("Requests")
      .aggregate(pipeline)
      .toArray();

    // Convert aggregation array into an object
    // Example: [{_id: "Pending", count: 2}] → { Pending: 2 }
    const statusCounts = results.reduce((acc, cur) => {
      acc[cur._id] = cur.count;
      return acc;
    }, {});

    // Return response
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
