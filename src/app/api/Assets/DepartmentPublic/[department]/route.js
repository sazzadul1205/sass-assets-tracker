// api/Assets/DepartmentPublic/[department]/route.js

import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

/**
 * GET /api/Assets/DepartmentPublic/[department]?includeAssigned=false
 * Fetch department assets (optionally include assigned ones).
 */
export const GET = async (req, context) => {
  try {
    // await params for Next.js 15+
    const { department } = await context.params;

    if (!department || typeof department !== "string") {
      return NextResponse.json(
        { success: false, message: "Valid department parameter is required." },
        { status: 400 }
      );
    }

    const decodedDepartment = decodeURIComponent(department);
    console.log("Decoded Department:", decodedDepartment);

    const { searchParams } = new URL(req.url);
    const includeAssigned = searchParams.get("includeAssigned") === "true";

    const db = await connectDB();

    // Base query
    const query = {
      department: { $regex: new RegExp(`^${decodedDepartment}$`, "i") },
    };

    // Add unassigned-only condition unless includeAssigned=true
    if (!includeAssigned) {
      query.assigned_to = "";
    }

    const assets = await db.collection("Assets").find(query).toArray();

    return NextResponse.json(
      {
        success: true,
        count: assets.length,
        includeAssigned,
        assets,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching department public assets:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch department assets. Please try again later.",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
};
