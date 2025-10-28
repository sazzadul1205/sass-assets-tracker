// src/app/api/Users/[email]/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

// GET request
export const GET = async (_req, { params }) => {
  try {
    // Extract email from params - AWAIT the params first
    const { email } = await params;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email parameter is required." },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const db = await connectDB();

    // Fetch user
    const user = await db.collection("Users").findOne({ email });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // Remove password
    const { password, ...safeUser } = user;

    // Return success response
    return NextResponse.json(
      { success: true, user: safeUser },
      { status: 200 }
    );
  } catch (error) {
    // Return error response
    console.error("[GET /Users/[email]] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};

// PUT request
export const PUT = async (_req, { params }) => {
  try {
    // Extract email from params
    const { email } = params;

    // Parse request body
    const body = await _req.json();

    // Validate email
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email parameter is required." },
        { status: 400 }
      );
    }

    // Validate request body
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: "Request body cannot be empty." },
        { status: 400 }
      );
    }

    // Prevent updating password here
    if (body.password) delete body.password;

    // Connect to MongoDB
    const db = await connectDB();

    // Update user
    const result = await db
      .collection("Users")
      .updateOne({ email }, { $set: body });

    // Check if user was updated
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json(
      { success: true, message: "User updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    // Log the error
    console.error("[PUT /Users/[email]] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
