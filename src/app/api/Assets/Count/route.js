// api/Assets/Count/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const db = await connectDB();

    // Count all documents in the Assets collection
    const totalAssets = await db.collection("Assets").countDocuments();

    return NextResponse.json({
      success: true,
      total: totalAssets,
    });
  } catch (error) {
    console.error("Error counting assets:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to count assets",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
