// api/Departments/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

// POST Method - Add a new department
export const POST = async (request) => {
  try {
    // Parse incoming data
    const newDepartment = await request.json();

    // Optional: Add timestamps if not provided
    newDepartment.createdAt = newDepartment.createdAt || new Date();
    newDepartment.updatedAt = newDepartment.updatedAt || new Date();

    // Connect to database
    const db = await connectDB();
    const departmentCollection = db.collection("Departments");

    // Insert department
    const result = await departmentCollection.insertOne(newDepartment);

    // Check if insertion was successful
    if (!result.acknowledged) {
      throw new Error("Insert operation failed");
    }

    // Respond with inserted department ID
    return NextResponse.json(
      {
        success: true,
        message: "Department added successfully",
        departmentId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding department:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while adding department",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};

// GET Method - Fetch all departments
export const GET = async () => {
  try {
    // Connect to database
    const db = await connectDB();
    const departmentCollection = db.collection("Departments");

    // Fetch all departments, newest first
    const departments = await departmentCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      {
        success: true,
        data: departments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching departments:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while fetching departments",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
