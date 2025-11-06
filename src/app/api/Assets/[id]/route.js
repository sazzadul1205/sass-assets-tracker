// api/Assets/[id]/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

/** GET: Fetch asset by ID */
export const GET = async (req, { params }) => {
  try {
    const { id } = params; // NO await here

    const db = await connectDB();
    const categoryCollection = db.collection("Assets");

    const query = id ? { _id: new ObjectId(id) } : {};

    const categories = await categoryCollection.find(query).toArray();

    return NextResponse.json(
      { success: true, data: categories },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching asset categories:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch asset category",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};

/** PUT: Update asset by ID */
export const PUT = async (request, { params }) => {
  try {
    const { id } = params; // NO await here

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid asset ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: "No update data provided" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const assetCollection = db.collection("Assets");

    const updateData = { ...body, updatedAt: new Date() };

    const result = await assetCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Asset updated successfully",
        modifiedCount: result.modifiedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating asset:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while updating asset",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};

/** DELETE: Delete asset by ID */
export const DELETE = async (request, { params }) => {
  try {
    const { id } = params; // NO await here

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid asset ID format" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const assetCollection = db.collection("Assets");

    const result = await assetCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Asset deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting asset:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while deleting asset",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
