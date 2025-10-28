// app/api/Users/Update/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const PUT = async (request) => {
  try {
    // Parse incoming JSON body
    const body = await request.json();
    const { email, name, dob, phone, profileImage, role } = body;

    // Validate input
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Connect to DB
    const db = await connectDB();
    const userCollection = db.collection("Users");

    // Check if user exists
    const existingUser = await userCollection.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Prepare update fields dynamically
    const updatedFields = {
      ...(name && { name }),
      ...(dob && { dob }),
      ...(phone && { phone }),
      ...(role && { role }),
      ...(profileImage && { profileImage }),
      updatedAt: new Date(),
    };

    // If no fields to update
    if (Object.keys(updatedFields).length <= 1) {
      return NextResponse.json(
        { success: false, message: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    // Perform update
    const result = await userCollection.updateOne(
      { email },
      { $set: updatedFields }
    );

    // Return success response
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "No changes were made" },
        { status: 200 }
      );
    }

    // Return success response
    return NextResponse.json(
      { success: true, message: "User updated successfully" },
      { status: 200 }
    );

    // Handle errors
  } catch (error) {
    // Handle errors
    console.error("[Users/Update] Error:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
