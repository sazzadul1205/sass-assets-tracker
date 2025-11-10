// api/Assets/Email/[email]/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

/**
 * GET /api/Assets/Email/[email]
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
export const GET = async (request, { params }) => {
  try {
    // Await and decode email
    const { email } = await params;
    const decodedEmail = decodeURIComponent(email);

    if (!decodedEmail || typeof decodedEmail !== "string") {
      return NextResponse.json(
        { success: false, message: "Valid email parameter is required." },
        { status: 400 }
      );
    }

    // Connect to DB
    const db = await connectDB();
    const assetCollection = db.collection("Assets");

    // Parse query params
    const {
      search,
      category,
      brand,
      condition,
      status,
      department,
      page = 1,
      limit = 10,
    } = Object.fromEntries(new URL(request.url).searchParams.entries());

    // Build filters
    const filters = {
      assigned_to: { $regex: new RegExp(`^${decodedEmail}$`, "i") }, // match email case-insensitively
    };

    if (search) filters.asset_name = { $regex: search, $options: "i" };
    if (category) filters.category_id = category;
    if (brand) filters.brand_name = brand;
    if (condition) filters.condition = condition;
    if (department) filters.department = department;

    // Handle assignment status filter
    if (status === "assigned") {
      filters.current_status = "Assigned";
    } else if (status === "unassigned") {
      filters.current_status = { $in: ["Not Assigned", "", null] };
    }

    // Count total assets
    const total = await assetCollection.countDocuments(filters);

    // Fetch assets with pagination
    const assets = await assetCollection
      .find(filters)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .toArray();

    // Return paginated response
    return NextResponse.json(
      {
        success: true,
        count: assets.length,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        assets,
      },
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
