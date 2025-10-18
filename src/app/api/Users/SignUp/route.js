// api/Users/SignUp/route.js
import { connectDB } from "@/lib/connectDB";
import bcrypt from "bcrypt";

export const POST = async (request) => {
  try {
    const newUser = await request.json();

    // Basic required fields validation
    const { name, email, password } = newUser;
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ message: "Missing required user data" }),
        { status: 400 }
      );
    }

    const db = await connectDB();
    const userCollection = db.collection("Users");

    // Check if user already exists
    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 409,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Whitelist only allowed fields
    const userToInsert = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await userCollection.insertOne(userToInsert);

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
