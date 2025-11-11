// api/AssetServices/[requestedBy]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";

// GET - Fetch Asset Requests by requestedBy (email)
export const GET = async (request, context) => {
  try {
    // Await params (important for Next.js 15+)
    const { requestedBy } = await context.params;

    const db = await connectDB();
    const requestsCollection = db.collection("AssetServices");

    if (!requestedBy) {
      return NextResponse.json(
        { success: false, message: "requestedBy parameter is required" },
        { status: 400 }
      );
    }

    // Find all requests for the specific user
    const requests = await requestsCollection
      .find({ requestedBy })
      .sort({ requestedAt: -1 })
      .toArray();

    return NextResponse.json(
      {
        success: true,
        count: requests.length,
        data: requests,
      },
      { status: 200 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching requests by requestedBy:", error);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while fetching user requests",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
