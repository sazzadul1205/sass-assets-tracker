// api/AssetServices/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

// POST - Create a new Asset Request
export const POST = async (request) => {
  try {
    const newRequest = await request.json();

    // Add timestamps if missing
    newRequest.requestedAt = newRequest.requestedAt || new Date();
    newRequest.updatedAt = newRequest.updatedAt || new Date();

    // Connect to DB
    const db = await connectDB();
    const requestsCollection = db.collection("AssetServices");

    // Insert new document
    const result = await requestsCollection.insertOne(newRequest);

    if (!result.acknowledged) {
      throw new Error("Failed to create new asset request");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Asset request created successfully",
        requestId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating asset request:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while creating asset request",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};

//  GET - Fetch all Asset Requests
export const GET = async (request) => {
  try {
    const db = await connectDB();
    const requestsCollection = db.collection("AssetServices");

    // Parse query params
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const status = searchParams.get("status");

    // Build filter dynamically
    const filter = {};
    if (department) filter.department = department;
    if (status) filter.status = status;

    // Fetch data
    const requests = await requestsCollection
      .find(filter)
      .sort({ requestedAt: -1 })
      .toArray();

    return NextResponse.json(
      {
        success: true,
        count: requests.length,
        data: requests,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching asset requests:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while fetching asset requests",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
