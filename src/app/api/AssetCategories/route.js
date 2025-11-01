// api/AssetCategories/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

// POST Method - Add a new asset category
export const POST = async (request) => {
  try {
    // Parse incoming data
    const newCategory = await request.json();

    // Optional: Add timestamps if not provided
    newCategory.createdAt = newCategory.createdAt || new Date();
    newCategory.updatedAt = newCategory.updatedAt || new Date();

    // Connect to database
    const db = await connectDB();
    const categoryCollection = db.collection("AssetCategories");

    // Insert category
    const result = await categoryCollection.insertOne(newCategory);

    // Check if insertion was successful
    if (!result.acknowledged) {
      throw new Error("Insert operation failed");
    }

    // Respond with inserted category ID
    return NextResponse.json(
      {
        success: true,
        message: "Asset category added successfully",
        categoryId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding asset category:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while adding asset category",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};

// GET Method - Fetch all asset categories
export const GET = async () => {
  try {
    // Connect to database
    const db = await connectDB();
    const categoryCollection = db.collection("AssetCategories");

    // Fetch all categories, newest first
    const categories = await categoryCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      {
        success: true,
        data: categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching asset categories:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while fetching asset categories",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
