// api/Assets/DepartmentPublic/[department]/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

/**
 * GET /api/Assets/DepartmentPublic/[department]
 * Query params:
 * - includeAssigned (boolean)
 * - search
 * - category
 * - brand
 * - condition
 * - status ("assigned" | "unassigned")
 * - page
 * - limit
 */
export const GET = async (req, context) => {
  try {
    const { department } = await context.params;

    if (!department || typeof department !== "string") {
      return NextResponse.json(
        { success: false, message: "Valid department parameter is required." },
        { status: 400 }
      );
    }

    const decodedDepartment = decodeURIComponent(department);

    const { searchParams } = new URL(req.url);

    const includeAssigned = searchParams.get("includeAssigned") === "true";
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const condition = searchParams.get("condition");
    const status = searchParams.get("status");
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    const db = await connectDB();
    const assetCollection = db.collection("Assets");

    // Build filters
    const filters = {
      department: { $regex: new RegExp(`^${decodedDepartment}$`, "i") },
    };

    if (!includeAssigned) filters.assigned_to = "";
    if (search) filters.asset_name = { $regex: search, $options: "i" };
    if (category) filters.category_id = category;
    if (brand) filters.brand_name = brand;
    if (condition) filters.condition = condition;

    if (status === "assigned") {
      filters.current_status = "Assigned";
    } else if (status === "unassigned") {
      filters.current_status = { $in: ["Not Assigned", "", null] };
    }

    const total = await assetCollection.countDocuments(filters);

    const assets = await assetCollection
      .find(filters)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json(
      {
        success: true,
        count: assets.length,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
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
