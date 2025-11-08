// api/Assets/Email/[email]/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async (_req, { params }) => {
  try {
    // Await the async params object
    const { email } = await params;

    // Decode in case email contains %40
    const decodedEmail = decodeURIComponent(email);

    if (!decodedEmail || typeof decodedEmail !== "string") {
      return NextResponse.json(
        { success: false, message: "Valid email parameter is required." },
        { status: 400 }
      );
    }

    const db = await connectDB();

    // Case-insensitive query for assigned_to
    const assets = await db
      .collection("Assets")
      .find({
        assigned_to: { $regex: new RegExp(`^${decodedEmail}$`, "i") },
      })
      .toArray();

    return NextResponse.json(
      { success: true, count: assets.length, assets },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching assets by email:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch assets. Please try again later.",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
};
