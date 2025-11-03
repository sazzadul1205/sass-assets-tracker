// api/AssetCategories/Names/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    // Connect to the database
    const db = await connectDB();
    const categoryCollection = db.collection("AssetCategories");

    // Fetch categories with only _id and name fields, sorted alphabetically
    const categories = await categoryCollection
      .find({}, { projection: { _id: 1, category_name: 1, category_code: 1 } })
      .sort({ name: 1 })
      .toArray();

    // Handle empty results gracefully
    if (!categories.length) {
      return NextResponse.json(
        {
          success: true,
          message: "No asset categories found.",
          data: [],
        },
        { status: 200 }
      );
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        count: categories.length,
        data: categories,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log detailed error in development only
    console.error("Error fetching asset category names:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch asset category names.",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error.",
      },
      { status: 500 }
    );
  }
};
