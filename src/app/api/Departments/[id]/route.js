// api/Departments/[id]/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// PUT: Update department by ID
export const PUT = async (req, { params }) => {
  try {
    const { id } = params;

    // Validate ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid department ID format" },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: "No update data provided" },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await connectDB();
    const departmentCollection = db.collection("Departments");

    // Prepare update object
    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    // Execute update
    const result = await departmentCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Department not found
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Department not found" },
        { status: 404 }
      );
    }

    // Success
    return NextResponse.json(
      {
        success: true,
        message: "Department updated successfully",
        modifiedCount: result.modifiedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating department:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while updating department",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
