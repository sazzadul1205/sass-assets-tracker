// api/Log/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    // Parse incoming data
    const newLog = await request.json();

    // Basic validation
    if (!newLog || typeof newLog !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid or missing log data" },
        { status: 400 }
      );
    }

    // Optional: Add createdAt timestamp if not provided
    newLog.createdAt = newLog.createdAt || new Date();

    // Connect to database
    const db = await connectDB();
    const logCollection = db.collection("Log");

    // Insert log entry
    const result = await logCollection.insertOne(newLog);

    // Check if insertion was successful
    if (!result.acknowledged) {
      throw new Error("Insert operation failed");
    }

    // Respond with inserted log ID
    return NextResponse.json(
      {
        success: true,
        message: "Log added successfully",
        logId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding log:", error);

    // Error differentiation
    const isValidationError = error.message?.includes("Invalid");

    return NextResponse.json(
      {
        success: false,
        message: isValidationError
          ? "Invalid log format or data"
          : "Internal Server Error while adding log",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: isValidationError ? 400 : 500 }
    );
  }
};
