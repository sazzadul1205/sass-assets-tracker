import { MongoClient, ServerApiVersion } from "mongodb";

let cachedClient = null;
let cachedDb = null;

/**
 * Establishes and caches a MongoDB connection.
 * Ensures a single persistent connection across serverless invocations.
 */
export async function connectDB() {
  if (cachedDb) {
    console.log("🔄 Using existing MongoDB connection");
    return cachedDb;
  }

  const { MONGODB_USER, MONGODB_PASS, MONGODB_CLUSTER, MONGODB_DB } =
    process.env;

  if (!MONGODB_USER || !MONGODB_PASS || !MONGODB_CLUSTER || !MONGODB_DB) {
    throw new Error(
      "❌ Missing MongoDB environment variables. Please check your .env configuration."
    );
  }

  const uri = `mongodb+srv://${encodeURIComponent(
    MONGODB_USER
  )}:${encodeURIComponent(
    MONGODB_PASS
  )}@${MONGODB_CLUSTER}/?retryWrites=true&w=majority&appName=Sass-Assets-Tracker`;

  try {
    // Reuse existing client if connected
    if (cachedClient && cachedClient.topology?.isConnected()) {
      console.log("✅ Reusing cached MongoDB client");
      cachedDb = cachedClient.db(MONGODB_DB);
      return cachedDb;
    }

    // Create new client instance
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 10, // helps control resource usage
      connectTimeoutMS: 10000, // 10 seconds timeout
    });

    // Connect to MongoDB Atlas
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas");

    // Select database
    const db = client.db(MONGODB_DB);
    console.log(`📁 Active database: ${db.databaseName}`);

    // Verify connection
    await db.command({ ping: 1 });
    console.log("📡 MongoDB connection verified and ready.");

    // Cache client and db for reuse
    cachedClient = client;
    cachedDb = db;

    return db;
  } catch (error) {
    console.error("🚨 MongoDB Connection Error:", error.message);

    // Helpful troubleshooting hints
    if (error.message.includes("ENOTFOUND")) {
      console.error(
        "🌐 Network issue: Unable to resolve MongoDB cluster hostname."
      );
    } else if (error.message.includes("Authentication failed")) {
      console.error(
        "🔑 Authentication error: Check username/password in .env."
      );
    }

    throw new Error(
      "MongoDB connection failed. Please review your configuration."
    );
  }
}

// Username : Sazzadul
// Password : Spritom1205

// mongodb+srv://Sazzadul:Spritom1205@sass-assets-tracker.7pahvyc.mongodb.net/?retryWrites=true&w=majority&appName=Sass-Assets-Tracker
