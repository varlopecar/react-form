#!/usr/bin/env node

// Load environment variables from the appropriate .env file
import dotenv from 'dotenv';

const nodeEnv = process.env.NODE_ENV || "development";
const envFile = nodeEnv === "production" ? '.env.production' : '.env';

dotenv.config({ path: envFile });

console.log("🔍 Testing Vite Environment Variables...");
console.log("========================================");

// Simulate Vite's environment variable loading
const env = {
    VITE_API_URL: process.env.VITE_API_URL || "http://localhost:8000",
    NODE_ENV: nodeEnv,
    VERCEL_ENV: process.env.VERCEL_ENV,
    RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT
};

console.log("📋 Current Environment:");
console.log(`   NODE_ENV: ${env.NODE_ENV}`);
console.log(`   VERCEL_ENV: ${env.VERCEL_ENV || 'not set'}`);
console.log(`   RAILWAY_ENVIRONMENT: ${env.RAILWAY_ENVIRONMENT || 'not set'}`);

console.log("\n🔗 API Configuration:");
console.log(`   VITE_API_URL: ${env.VITE_API_URL}`);
console.log(`   Environment File: ${envFile}`);

// Check if the API URL is correct for the environment
const isProduction = env.NODE_ENV === "production" || env.VERCEL_ENV || env.RAILWAY_ENVIRONMENT;
const expectedUrl = isProduction
    ? "https://backend-44yunag51-varlopecars-projects.vercel.app"
    : "http://localhost:8000";

console.log(`\n✅ Expected API URL: ${expectedUrl}`);
console.log(`🔍 Actual API URL: ${env.VITE_API_URL}`);

if (env.VITE_API_URL === expectedUrl) {
    console.log("✅ API URL is correct for the current environment!");
} else {
    console.log("❌ API URL mismatch! Check your environment configuration.");
}

console.log("\n🚀 To test with production settings:");
console.log("   NODE_ENV=production npm run dev");
console.log("\n🚀 To test with local settings:");
console.log("   npm run dev"); 