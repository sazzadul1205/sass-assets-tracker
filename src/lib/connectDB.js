// lib/connectDB.js
import { MongoClient, ServerApiVersion } from "mongodb";

let client = null;

export async function connectDB() {
  // Check if we have a connected client
  if (client && client.topology?.isConnected()) {
    console.log("♻️ Using existing MongoDB connection");
    return client.db(process.env.MONGODB_DB);
  }

  // Reset if client exists but is disconnected
  if (client) {
    await client.close().catch(console.error);
    client = null;
    console.log("🔄 Closed disconnected MongoDB client");
  }

  // Get MongoDB environment variables
  const { MONGODB_USER, MONGODB_PASS, MONGODB_CLUSTER, MONGODB_DB } =
    process.env;

  // Check if MongoDB environment variables are defined
  if (!MONGODB_USER || !MONGODB_PASS || !MONGODB_CLUSTER || !MONGODB_DB) {
    throw new Error(
      "Missing MongoDB environment variables. Please check your .env configuration."
    );
  }

  // Build MongoDB connection URI
  const uri = `mongodb+srv://${encodeURIComponent(
    MONGODB_USER
  )}:${encodeURIComponent(
    MONGODB_PASS
  )}@${MONGODB_CLUSTER}/?retryWrites=true&w=majority&appName=Sass-Assets-Tracker`;

  try {
    console.log("🔗 Establishing new MongoDB connection...");

    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 15,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas");

    // Verify connection
    const db = client.db(MONGODB_DB);
    await db.command({ ping: 1 });
    console.log(`📊 Active database: ${MONGODB_DB}`);

    return db;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);

    // Helpful troubleshooting hints
    if (error.message.includes("ENOTFOUND")) {
      console.error(
        "Network issue: Unable to resolve MongoDB cluster hostname."
      );
    } else if (error.message.includes("Authentication failed")) {
      console.error("Authentication error: Check username/password in .env.");
    }

    // Reset on error
    client = null;
    throw new Error(
      "MongoDB connection failed. Please review your configuration."
    );
  }
}

// Username : Sazzadul
// Password : Spritom1205

// mongodb+srv://Sazzadul:Spritom1205@sass-assets-tracker.7pahvyc.mongodb.net/?retryWrites=true&w=majority&appName=Sass-Assets-Tracker
