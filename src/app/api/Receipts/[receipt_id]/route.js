// app/api/Receipts/[receipt_id]/route.js
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export const GET = async (request, context) => {
  try {
    const params = await context.params;
    const { receipt_id } = params;

    console.log("Received receipt_id:", receipt_id);

    const db = await connectDB();
    const receiptCollection = db.collection("Receipt");

    // Only query ObjectId
    let receipt = null;
    if (ObjectId.isValid(receipt_id)) {
      receipt = await receiptCollection.findOne({
        _id: new ObjectId(receipt_id),
      });
    }

    if (!receipt) {
      console.log("No receipt found for:", receipt_id);
      return NextResponse.json({
        success: true,
        receipt: null,
        message: "No receipt found for the provided ID",
      });
    }

    // Extract basic info
    const basicInfo = {
      asset_name: receipt.asset_name || "N/A",
      asset_id: receipt.asset_id || "N/A",
      received_by: receipt.received_by || "N/A",
    };

    return NextResponse.json({
      success: true,
      receipt: basicInfo,
    });
  } catch (error) {
    console.error("Error fetching receipt:", error);
    return NextResponse.json({
      success: true,
      receipt: null,
      message: "Error fetching receipt",
    });
  }
};
