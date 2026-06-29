import "dotenv/config";
import { db } from "../db/index.js";
import { applications } from "../db/schema.js";
import crypto from "crypto";

async function registerClient() {
  try {
    const clientId = crypto.randomBytes(16).toString("hex");
    const clientSecret = crypto.randomBytes(32).toString("hex");
    
    // Generate a random app name if not provided
    const appName = process.argv[2] || `App-${Date.now()}`;
    const redirectUri = process.argv[3] || "http://localhost:3001/callback";

    const [client] = await db.insert(applications).values({
      clientId,
      clientSecret,
      name: appName,
      redirectUri,
    }).returning();

    if (!client) {
      throw new Error("Failed to create client");
    }

    console.log("✅ Client registered successfully!");
    console.log("📋 Client ID:", client.clientId);
    console.log("🔑 Client Secret:", client.clientSecret);
    console.log("🔗 Redirect URI:", client.redirectUri);
    console.log("📝 App Name:", client.name);
    
    console.log("\n📌 Save these credentials securely!");
    console.log("Client ID:", client.clientId);
    console.log("Client Secret:", client.clientSecret);
  } catch (error) {
    console.error("❌ Error registering client:", error);
    process.exit(1);
  }
}

registerClient();
