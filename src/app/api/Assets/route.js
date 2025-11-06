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
      search,
      category,
      department,
      assignedUser,
      page = 1,
      limit = 10,
    } = Object.fromEntries(new URL(request.url).searchParams.entries());

    // Build filters
    const filters = {};

    // Add filters based on query parameters
    if (search) filters.asset_name = { $regex: search, $options: "i" };
    if (category) filters.category_id = category;
    if (department) filters.department = department;
    if (assignedUser) filters.assigned_to = assignedUser;

    // Fetch assets
    const total = await assetCollection.countDocuments(filters);

    // Fetch assets
    const assets = await assetCollection
      .find(filters)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .toArray();

    // Ensure it always returns an array
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
    // Handle errors
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
