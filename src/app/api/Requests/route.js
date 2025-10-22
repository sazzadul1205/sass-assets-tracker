// api/Requests/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    const newRequest = await request.json();

    // Basic validation
    if (!newRequest?.request_title || !newRequest?.request_type) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: request_title or request_type",
        },
        { status: 400 }
      );
    }

    // Connect to DB
    const db = await connectDB();
    const requestCollection = db.collection("Requests");

    // Insert the request
    const result = await requestCollection.insertOne({
      ...newRequest,
      created_at: newRequest.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Return successful response
    return NextResponse.json(
      {
        success: true,
        message: "Request created successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Requests API] Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
