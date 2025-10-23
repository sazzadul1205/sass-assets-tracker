// api/Requests/id/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { ObjectId } from "mongodb";

export const PUT = async (req, context) => {
  const { id } = await context.params;

  // Validate the presence of ID
  if (!id) {
    return NextResponse.json(
      { success: false, message: "Missing request ID" },
      { status: 400 }
    );
  }

  try {
    // Parse request body
    const body = await req.json();

    // Validate that body has at least one field to update
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: "No data provided for update" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const db = await connectDB();

    // Perform the update
    const result = await db.collection("Requests").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...body,
          updated_at: new Date().toISOString(), // update timestamp
        },
      }
    );

    // If no document matched the ID
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Request not found" },
        { status: 404 }
      );
    }

    // Successful update
    return NextResponse.json({
      success: true,
      message: "Request updated successfully",
    });
  } catch (error) {
    // Log and return server error
    console.error("Error updating request:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update request" },
      { status: 500 }
    );
  }
};
