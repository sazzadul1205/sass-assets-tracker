// api/Log/[email]/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

// GET request
export const GET = async (req, { params }) => {
  try {
    const { email } = params; // using email to identify user
    const { searchParams } = new URL(req.url);

    // Pagination params
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Connect to MongoDB
    const db = await connectDB();

    // ---------- Auto cleanup: remove oldest logs if >50 ----------
    const totalLogs = await db
      .collection("Log")
      .countDocuments({ logged_by: email });
    if (totalLogs > 50) {
      const excess = totalLogs - 50;
      // Delete oldest documents
      await db
        .collection("Log")
        .find({ logged_by: email })
        .sort({ createdAt: 1 }) // oldest first
        .limit(excess)
        .forEach(async (doc) => {
          await db.collection("Log").deleteOne({ _id: doc._id });
        });
    }

    // ---------- Fetch paginated logs ----------
    const logs = await db
      .collection("Log")
      .find({ logged_by: email }) // query by logged_by
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit)
      .toArray();

    // Total count for pagination info
    const total = await db
      .collection("Log")
      .countDocuments({ logged_by: email });

    return NextResponse.json(
      {
        success: true,
        data: logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching log entries:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching log entries",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
