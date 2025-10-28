// api/Log/[email]/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async (req, context) => {
  try {
    // Await params (important!)
    const { email } = await context.params;
    const { searchParams } = new URL(req.url);

    // Pagination
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Connect to MongoDB
    const db = await connectDB();
    const logCollection = db.collection("Log");

    // ---------- Auto cleanup: keep max 50 logs per user ----------
    const totalLogs = await logCollection.countDocuments({ logged_by: email });

    // Check if there are more than 50 logs
    if (totalLogs > 50) {
      // Calculate how many logs to delete
      const excess = totalLogs - 50;

      // Fetch oldest logs
      const oldestLogs = await logCollection
        .find({ logged_by: email })
        .sort({ createdAt: 1 }) // oldest first
        .limit(excess)
        .toArray();

      // Delete oldest logs
      const idsToDelete = oldestLogs.map((doc) => doc._id);

      // Delete oldest logs
      if (idsToDelete.length > 0) {
        await logCollection.deleteMany({ _id: { $in: idsToDelete } });
      }
    }

    // ---------- Fetch paginated logs ----------
    const logs = await logCollection
      .find({ logged_by: email })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // ---------- Count total logs ----------
    const total = await logCollection.countDocuments({ logged_by: email });

    // Return success response
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
    // Log error
    console.error("Error fetching log entries:", error);

    // Return error response
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
