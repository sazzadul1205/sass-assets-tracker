// app/api/Users/Update/route.js
import { connectDB } from "@/lib/connectDB";

// PUT request
export const PUT = async (request) => {
  try {
    // Get request body
    const data = await request.json();

    // Destructure data
    const { email, name, dob, phone, profileImage } = data;

    // Basic required fields validation
    if (!email) {
      return new Response(JSON.stringify({ message: "Email is required" }), {
        status: 400,
      });
    }

    // Connect to DB
    const db = await connectDB();

    // Get user collection
    const userCollection = db.collection("Users");

    // Check if user exists
    const user = await userCollection.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Prepare fields to update
    const updatedFields = {
      // Update fields
      ...(dob && { dob }),
      ...(name && { name }),
      ...(phone && { phone }),
      ...(profileImage && { profileImage }),

      // Update timestamps
      updatedAt: new Date(),
    };

    // Update user in DB
    await userCollection.updateOne({ email }, { $set: updatedFields });

    // Return success response
    return new Response(
      JSON.stringify({ message: "User updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    // Return error response
    console.error("[Update User API] Error:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      { status: 500 }
    );
  }
};
