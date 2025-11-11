// api/Assets/IdArray/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { ObjectId } from "mongodb";

export const GET = async (request) => {
  try {
    const db = await connectDB();
    const assetsCollection = db.collection("Assets");

    const { searchParams } = new URL(request.url);

    // Accept both `ids` and `ids[]`
    let ids = searchParams.getAll("ids");
    if (!ids.length) ids = searchParams.getAll("ids[]");

    if (!ids.length) {
      return NextResponse.json(
        { success: false, message: "An array of asset IDs is required" },
        { status: 400 }
      );
    }

    const objectIds = ids.map((id) => new ObjectId(id));

    const assets = await assetsCollection
      .find({ _id: { $in: objectIds } })
      .toArray();

    return NextResponse.json(
      { success: true, count: assets.length, data: assets },
      { status: 200 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
