// api/Assets/Conditions/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const db = await connectDB();
    const assetCollection = db.collection("Assets");

    // Use aggregation to get unique conditions
    const uniqueConditionsAgg = await assetCollection
      .aggregate([
        { $match: { condition: { $exists: true, $ne: null } } }, // optional: exclude null/undefined
        { $group: { _id: "$condition" } },
        { $sort: { _id: 1 } }, // optional: sort alphabetically
      ])
      .toArray();

    const uniqueConditions = uniqueConditionsAgg.map((doc) => doc._id);

    return NextResponse.json(
      {
        success: true,
        data: uniqueConditions,
        total: uniqueConditions.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching unique asset conditions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while fetching conditions",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
