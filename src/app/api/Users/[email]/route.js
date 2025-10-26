// src/app/api/Users/[email]/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

// GET request
export const GET = async (req, { params }) => {
  try {
    // Destructure params
    const { email } = params;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email parameter is required." },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const db = await connectDB();

    // Fetch full user document
    const user = await db.collection("Users").findOne({ email });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // Remove sensitive fields before sending
    const { password, ...safeUser } = user;

    // Return the user safely
    return NextResponse.json(
      { success: true, user: safeUser },
      { status: 200 }
    );
  } catch (error) {
    // Log the error
    console.error("Error fetching user by email:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

// PUT request
export const PUT = async (req, { params }) => {
  try {
    // Destructure params
    const { email } = params;

    // Parse request body
    const body = await req.json();

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

    // Connect to MongoDB
    const db = await connectDB();

    // Example: prevent direct password update through this route
    if (body.password) delete body.password;

    // Update the user
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
    console.error("Error updating user:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
