// app/api/Users/Update/route.js
import { connectDB } from "@/lib/connectDB";

export const PUT = async (request) => {
  try {
    const data = await request.json();
    const { email, name, dob, phone, organization, designation } = data;

    if (!email) {
      return new Response(JSON.stringify({ message: "Email is required" }), {
        status: 400,
      });
    }

    const db = await connectDB();
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
      ...(name && { name }),
      ...(dob && { dob }),
      ...(phone && { phone }),
      ...(organization && { organization }),
      ...(designation && { designation }),
      updatedAt: new Date(),
    };

    // Update user in DB
    await userCollection.updateOne({ email }, { $set: updatedFields });

    return new Response(
      JSON.stringify({ message: "User updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
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
