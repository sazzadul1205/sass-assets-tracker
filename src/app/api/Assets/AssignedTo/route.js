// api/Assets/AssignedTo/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const db = await connectDB();
    const assetCollection = db.collection("Assets");

    // Fetch all assets with only necessary fields
    const assets = await assetCollection
      .find({})
      .project({ _id: 1, isPrivate: 1, assigned_to: 1 }) // only _id, isPrivate, assigned_to
      .toArray();

    const grouped = {};

    assets.forEach((asset) => {
      // Skip if isPrivate field does not exist
      if (asset.isPrivate === undefined) return;

      if (asset.isPrivate) {
        // Private asset: group by assigned_to if exists and not "Not Assigned"
        if (asset.assigned_to && asset.assigned_to !== "Not Assigned") {
          if (!grouped[asset.assigned_to]) {
            grouped[asset.assigned_to] = [];
          }
          grouped[asset.assigned_to].push(asset._id);
        }
      } else {
        // Public asset: group under "Public"
        if (!grouped["Public"]) {
          grouped["Public"] = [];
        }
        grouped["Public"].push(asset._id);
      }
    });

    // Convert grouped object to array
    const result = Object.keys(grouped).map((key) => ({
      group: key, // email or "Public"
      asset_ids: grouped[key],
    }));

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error grouping assets by assigned_to:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while grouping assets",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
