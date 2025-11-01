// api/AssetCategories/[id]/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET: Get Asset Category by ID
export const GET = async (req, { params }) => {
  try {
    const { id } = params;

    // Validate ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Asset Category ID format" },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await connectDB();
    const category = await db
      .collection("AssetCategories")
      .findOne({ _id: new ObjectId(id) });

    // Category not found
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Asset Category not found" },
        { status: 404 }
      );
    }

    // Success
    return NextResponse.json(
      { success: true, data: category },
      { status: 200 }
    );
  } catch (error) {
    // Log error
    console.error("Error fetching Asset Category:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while fetching Asset Category",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};

// PUT: Update Asset Category by ID
export const PUT = async (req, { params }) => {
  try {
    const { id } = params;

    // Validate ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Asset Category ID format" },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: "No update data provided" },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await connectDB();
    const categoryCollection = db.collection("AssetCategories");

    // Prepare update object
    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    // Execute update
    const result = await categoryCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Category not found
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Asset Category not found" },
        { status: 404 }
      );
    }

    // Success
    return NextResponse.json(
      {
        success: true,
        message: "Asset Category updated successfully",
        modifiedCount: result.modifiedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error
    console.error("Error updating Asset Category:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while updating Asset Category",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};

// DELETE: Delete Asset Category by ID
export const DELETE = async (req, { params }) => {
  try {
    const { id } = params;

    // Validate ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Asset Category ID format" },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await connectDB();
    const result = await db
      .collection("AssetCategories")
      .deleteOne({ _id: new ObjectId(id) });

    // Category not found
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Asset Category not found" },
        { status: 404 }
      );
    }

    // Success
    return NextResponse.json(
      { success: true, message: "Asset Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Log error
    console.error("Error deleting Asset Category:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while deleting Asset Category",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
