// api/Assets/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

// POST Method - Add a new asset
export const POST = async (request) => {
  try {
    // Parse incoming data
    const newAsset = await request.json();

    // Validate required fields (example: asset_name, category_id)
    if (!newAsset.asset_name || !newAsset.category_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: asset_name or category_id",
        },
        { status: 400 }
      );
    }

    // Add timestamps if not provided
    const timestamp = new Date();
    newAsset.createdAt = newAsset.createdAt || timestamp;
    newAsset.updatedAt = newAsset.updatedAt || timestamp;

    // Connect to database
    const db = await connectDB();
    const assetCollection = db.collection("Assets");

    // Insert asset
    const result = await assetCollection.insertOne(newAsset);

    if (!result.acknowledged) {
      throw new Error("Insert operation failed");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Asset added successfully",
        assetId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
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

// GET Method - Fetch all assets
export const GET = async () => {
  try {
    const db = await connectDB();
    const assetCollection = db.collection("Assets");

    const assets = await assetCollection
      .find({})
      .sort({ createdAt: -1 }) // newest first
      .toArray();

    return NextResponse.json(
      {
        success: true,
        data: assets,
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
