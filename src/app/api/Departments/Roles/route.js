// api/Departments/Roles/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

// GET Method - Fetch all roles across departments
export const GET = async () => {
  try {
    const db = await connectDB();
    const departmentCollection = db.collection("Departments");

    // Fetch all departments with only the required fields
    const departments = await departmentCollection
      .find(
        {},
        { projection: { department_Name: 1, description: 1, roles: 1, _id: 1 } }
      )
      .toArray();

    return NextResponse.json(
      { success: true, data: departments },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching roles:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while fetching roles",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
