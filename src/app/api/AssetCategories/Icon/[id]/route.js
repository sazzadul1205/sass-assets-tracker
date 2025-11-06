// src/app/api/AssetCategories/Icon/[id]/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export const GET = async (request, context) => {
  try {
    const params = await context.params;

    // Connect to MongoDB
    const db = await connectDB();
    const categoryCollection = db.collection("AssetCategories");

    // Optionally fetch by specific ID
    const query = params?.id ? { _id: new ObjectId(params.id) } : {};

    const categories = await categoryCollection
      .find(query, {
        projection: {
          icon_url: 1,
          icon_color: 1,
          category_name: 1,
          category_code: 1,
        },
      })
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(
      {
        success: true,
        count: categories.length,
        data: categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching asset category icons:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch asset category icons.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
