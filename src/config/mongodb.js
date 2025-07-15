// MongoDB Atlas Data API configuration
// Note: This is safer than exposing database credentials directly
// You'll need to enable the Data API in your MongoDB Atlas cluster

const ATLAS_CONFIG = {
  dataSource: "Cluster0", // Your cluster name
  database: "abowe-whitelist",
  collection: "waitlist",
  // You'll need to get this URL from your MongoDB Atlas Data API settings
  baseUrl: "https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint/data/v1"
}

// For demo purposes, using a direct connection (NOT RECOMMENDED for production)
// In production, you should use the Data API with proper authentication
export const mongoConfig = {
  connectionString: "mongodb+srv://fahad:Fahad%40123@cluster0.tri5xk7.mongodb.net/abowe-whitelist",
  database: "abowe-whitelist",
  collection: "waitlist"
}

export default ATLAS_CONFIG
