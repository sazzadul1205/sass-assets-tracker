// api/Assets/Category/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const db = await connectDB();
    const assetCollection = db.collection("Assets");

    // Fetch all assets, only _id and category_id
    const assets = await assetCollection
      .find({ category_id: { $exists: true, $ne: null } })
      .project({ _id: 1, category_id: 1 })
      .toArray();

    // Group assets by category_id
    const grouped = assets.reduce((acc, asset) => {
      const catId = asset.category_id;

      if (!acc[catId]) {
        acc[catId] = [];
      }
      acc[catId].push(asset._id);

      return acc;
    }, {});

    // Convert grouped object into array format
    const result = Object.keys(grouped).map((catId) => ({
      category_id: catId,
      asset_ids: grouped[catId],
    }));

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching asset IDs by category:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while fetching asset IDs by category",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
