// src/app/api/Users/[email]/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

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
