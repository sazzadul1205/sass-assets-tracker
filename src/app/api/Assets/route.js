// api/Assets/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

// POST Method - Add a new asset
export const POST = async (request) => {
  try {
    // Parse incoming data
    const newAsset = await request.json();

    // Basic validation
    if (!newAsset.asset_name || !newAsset.category_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: asset_name or category_id",
        },
        { status: 400 }
      );
    }

    // Optional: Add timestamps if not provided
    const timestamp = new Date();
    newAsset.createdAt = newAsset.createdAt || timestamp;
    newAsset.updatedAt = newAsset.updatedAt || timestamp;

    // Connect to database
    const db = await connectDB();
    const assetCollection = db.collection("Assets");

    // Insert asset
    const result = await assetCollection.insertOne(newAsset);

    // Check if insertion was successful
    if (!result.acknowledged) throw new Error("Insert operation failed");

    // Respond with inserted asset ID
    return NextResponse.json(
      {
        success: true,
        message: "Asset added successfully",
        assetId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle errors
    console.error("Error adding asset:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while adding asset",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};

// GET Method - Fetch assets with pagination & filters
export const GET = async (request) => {
  try {
    // Connect to database
    const db = await connectDB();
    const assetCollection = db.collection("Assets");

    // Parse query parameters
    const {
      status,
      search,
      category,
      page = 1,
      limit = 10,
      department,
      assignedUser,
    } = Object.fromEntries(new URL(request.url).searchParams.entries());

    // Build filters
    const filters = {};

    // Apply filters based on query parameters
    if (search) filters.asset_name = { $regex: search, $options: "i" };
    if (category) filters.category_id = category;
    if (department) filters.department = department;
    if (assignedUser) filters.assigned_to = assignedUser;

    // Handle assignment status filter
    if (status === "assigned") {
      filters.current_status = "Assigned";
    } else if (status === "unassigned") {
      filters.current_status = { $in: ["Not Assigned", "", null] };
    }
    // if status === "all", we don’t add any extra filter

    // Get total count
    const total = await assetCollection.countDocuments(filters);

    // Fetch assets with pagination
    const assets = await assetCollection
      .find(filters)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .toArray();

    // Respond with paginated results
    return NextResponse.json(
      {
        success: true,
        data: assets,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching assets:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while fetching assets",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
