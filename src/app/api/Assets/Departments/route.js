// api/Assets/Departments/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const db = await connectDB();
    const assetCollection = db.collection("Assets");

    // Fetch all assets, excluding those with department "Not Assigned"
    const assets = await assetCollection
      .find({ department: { $ne: "Not Assigned" } })
      .project({ _id: 1, department: 1 }) // Only fetch _id and department
      .toArray();

    // Group assets by department _id
    const grouped = assets.reduce((acc, asset) => {
      const deptId = asset.department;

      if (!acc[deptId]) {
        acc[deptId] = [];
      }
      acc[deptId].push(asset._id);

      return acc;
    }, {});

    // Convert the grouped object into an array format
    const result = Object.keys(grouped).map((deptId) => ({
      department_id: deptId,
      asset_ids: grouped[deptId], // Only _id of assets
    }));

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching asset IDs by department:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while fetching asset IDs by department",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
