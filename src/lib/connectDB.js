// lib/connectDB.js
import { MongoClient, ServerApiVersion } from "mongodb";

let client = null;
let clientPromise = null;

/**
 * Connect to MongoDB using a cached client to prevent multiple connections
 * in development (Next.js hot reload) and serverless environments.
 */
export async function connectDB() {
  // Use global cache in development to avoid exceeding connection limit
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const { MONGODB_USER, MONGODB_PASS, MONGODB_CLUSTER, MONGODB_DB } =
        process.env;

      if (!MONGODB_USER || !MONGODB_PASS || !MONGODB_CLUSTER || !MONGODB_DB) {
        throw new Error(
          "Missing MongoDB environment variables. Check your .env"
        );
      }

      const uri = `mongodb+srv://${encodeURIComponent(
        MONGODB_USER
      )}:${encodeURIComponent(
        MONGODB_PASS
      )}@${MONGODB_CLUSTER}/?retryWrites=true&w=majority&appName=Sass-Assets-Tracker`;

      const tempClient = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        maxPoolSize: 15,
        connectTimeoutMS: 15000,
        socketTimeoutMS: 45000,
      });

      global._mongoClientPromise = tempClient.connect().then(() => tempClient);
    }

    client = await global._mongoClientPromise;
    return client.db(process.env.MONGODB_DB);
  }

  // Production / non-dev fallback
  if (client && client.topology?.isConnected()) {
    console.log("♻️ Using existing MongoDB connection");
    return client.db(process.env.MONGODB_DB);
  }

  // Close disconnected client if any
  if (client) {
    await client.close().catch(console.error);
    client = null;
    console.log("🔄 Closed disconnected MongoDB client");
  }

  // Environment variables check
  const { MONGODB_USER, MONGODB_PASS, MONGODB_CLUSTER, MONGODB_DB } =
    process.env;

  if (!MONGODB_USER || !MONGODB_PASS || !MONGODB_CLUSTER || !MONGODB_DB) {
    throw new Error(
      "Missing MongoDB environment variables. Please check your .env configuration."
    );
  }

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

    const db = client.db(MONGODB_DB);
    await db.command({ ping: 1 });
    console.log(`📊 Active database: ${MONGODB_DB}`);

    return db;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);

    if (error.message.includes("ENOTFOUND")) {
      console.error(
        "Network issue: Unable to resolve MongoDB cluster hostname."
      );
    } else if (error.message.includes("Authentication failed")) {
      console.error("Authentication error: Check username/password in .env.");
    }

    client = null;
    throw new Error(
      "MongoDB connection failed. Please review your configuration."
    );
  }
}
