// api/Users/SignUp/route.js
import { connectDB } from "@/lib/connectDB";
import bcrypt from "bcrypt";

export const POST = async (request) => {
  console.log("🚀 /api/Users/SignUp POST called");

  try {
    const newUser = await request.json();

    if (!newUser || !newUser.email || !newUser.password) {
      return new Response(
        JSON.stringify({ message: "Missing required user data" }),
        { status: 400 }
      );
    }

    const db = await connectDB();
    const userCollection = db.collection("Users");

    // Check if user exists
    const existingUser = await userCollection.findOne({ email: newUser.email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 409,
      });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    // Insert new user with hashed password
    const result = await userCollection.insertOne({
      ...newUser,
      password: hashedPassword,
      createdAt: new Date(),
    });

    console.log(`User created successfully: ${result.insertedId}`);

    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        userId: result.insertedId,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("[SignUp API] Error:", error.message);

    return new Response(
      JSON.stringify({
        message: "Internal server error. Please try again later.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      { status: 500 }
    );
  }
};
