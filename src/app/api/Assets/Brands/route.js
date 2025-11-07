// api/Assets/Brands/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const db = await connectDB();
    const assetCollection = db.collection("Assets");

    // Use aggregation to get unique brand_name values
    const uniqueBrandsAgg = await assetCollection
      .aggregate([
        { $match: { brand_name: { $exists: true, $ne: null, $ne: "" } } }, // exclude null/empty
        { $group: { _id: "$brand_name" } },
        { $sort: { _id: 1 } }, // optional: alphabetical sort
      ])
      .toArray();

    const uniqueBrands = uniqueBrandsAgg.map((doc) => doc._id);

    return NextResponse.json(
      {
        success: true,
        data: uniqueBrands,
        total: uniqueBrands.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching unique asset brands:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while fetching brands",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
