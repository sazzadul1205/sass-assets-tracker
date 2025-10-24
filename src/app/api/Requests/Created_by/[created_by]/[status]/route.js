// api/Requests/Created_by/[created_by]/[status]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";

export const GET = async (req, context) => {
  // Await params
  const params = await context.params;

  // Destructure params
  const created_by = params?.created_by;
  const status = params?.status;

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

    // Build base query
    const query = { created_by };

    // If status is provided and not "all", format properly
    if (status && status.toLowerCase() !== "all") {
      // Handle multi-word statuses (like "Working On")
      const formattedStatus = status
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");

      // Normalize "cancelled" and "canceled"
      query.status =
        formattedStatus === "Cancelled" ? "Canceled" : formattedStatus;
    }

    // Fetch requests
    const requests = await db
      .collection("Requests")
      .find(query)
      .sort({ created_at: -1 })
      .toArray();

    // Ensure it always returns an array
    return NextResponse.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    // Log error
    console.error("Error fetching requests:", error);

    // Return error
    return NextResponse.json(
      { success: false, message: "Failed to fetch requests" },
      { status: 500 }
    );
  }
};
