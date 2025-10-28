// api/Users/AllUsers/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async (_req, context) => {
  try {
    const db = await connectDB();

    // Fetch users where role is "Employee" or role field does not exist
    const query = { $or: [{ role: "Employee" }, { role: { $exists: false } }] };

    // Fetch users
    const users = await db
      .collection("Users")
      .find(query)
      .sort({ name: 1 }) // optional sorting
      .toArray();

    //   Return success response
    return NextResponse.json(
      { success: true, data: users, total: users.length },
      { status: 200 }
    );

    //  Return error response
  } catch (error) {
    // Log the error
    console.error("[AllUsers API] Error fetching users:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};
