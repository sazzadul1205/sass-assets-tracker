// api/Users/VerifyPassword/[email]/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (request, context) => {
  try {
    // Extract email from params
    const { email } = context.params;
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Get oldPassword from request body
    const { oldPassword } = await request.json();
    if (!oldPassword) {
      return NextResponse.json(
        { success: false, message: "Old password is required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const db = await connectDB();
    const userCollection = db.collection("Users");

    // Find user
    const user = await userCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 401 }
      );
    }

    // Password verified
    return NextResponse.json(
      { success: true, message: "Password verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[VerifyPassword API] Error:", error);
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
