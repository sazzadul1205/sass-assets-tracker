// api/Receipts/MultiFetch/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("request_ids");

    if (!idsParam) {
      return NextResponse.json(
        { success: false, message: "Missing 'request_ids' query parameter." },
        { status: 400 }
      );
    }

    // Split, clean, filter duplicates, and trim whitespace
    const requestIds = Array.from(
      new Set(
        idsParam
          .split(",")
          .map((id) => id.trim().replace(/['"]/g, "")) // remove quotes & spaces
          .filter(Boolean)
      )
    );

    if (requestIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "Provide at least one valid request_id." },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const db = await connectDB();
    const receiptsCollection = db.collection("Receipt");

    // Fetch receipts for only the existing IDs
    const receipts = await receiptsCollection
      .find({ request_id: { $in: requestIds } })
      .toArray();

    // Only return the matching receipts
    return NextResponse.json(
      {
        success: true,
        data: receipts, // will automatically exclude non-existent IDs
        message: receipts.length
          ? "Receipts fetched successfully."
          : "No receipts found for the given IDs.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching receipts:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error." },
      { status: 500 }
    );
  }
};
