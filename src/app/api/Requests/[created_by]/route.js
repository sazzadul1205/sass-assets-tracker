// api/Requests/[created_by]/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async (_req, { params }) => {
  const { created_by } = params;

  if (!created_by) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing 'created_by' parameter",
        requests: [],
      },
      { status: 400 }
    );
  }

  try {
    const db = await connectDB();

    const requests = await db
      .collection("Requests")
      .find({ created_by })
      .sort({ created_at: -1 }) // latest first
      .toArray();

    // Ensure it always returns an array
    return NextResponse.json({
      success: true,
      requests: requests || [],
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch requests", requests: [] },
      { status: 500 }
    );
  }
};
