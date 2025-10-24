// api/Receipt/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

// Required fields for a receipt
const REQUIRED_FIELDS = ["received_by", "handover_date", "recept_items"];

export const POST = async (request) => {
  try {
    const newReceipt = await request.json();

    // Validate payload
    if (!newReceipt || typeof newReceipt !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid or missing receipt data" },
        { status: 400 }
      );
    }

    // Check for required fields
    const missingFields = REQUIRED_FIELDS.filter(
      (field) => !newReceipt[field] || newReceipt[field]?.length === 0
    );

    // Return error if required fields are missing
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required field(s): ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Connect to DB
    const db = await connectDB();
    const receiptCollection = db.collection("Receipt");

    // Insert receipt
    const result = await receiptCollection.insertOne({
      ...newReceipt,
      createdAt: new Date(), // add timestamp
    });

    // Check if insertion was successful
    if (!result.acknowledged) {
      throw new Error("Failed to save receipt");
    }

    // Respond with inserted log ID
    return NextResponse.json(
      {
        success: true,
        message: "Receipt saved successfully",
        data: result.insertedId,
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
