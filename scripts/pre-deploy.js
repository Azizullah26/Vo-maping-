// Pre-deployment script to ensure the project is ready for deployment
const { execSync } = require("child_process")
const fs = require("fs")

console.log("Running pre-deployment checks...")

// Run the unicode escape fix script
console.log("Fixing any unicode escape issues...")
try {
  execSync("node scripts/fix-unicode-escapes.js", { stdio: "inherit" })
} catch (error) {
  console.error("Failed to run unicode escape fix:", error)
  process.exit(1)
}

// Check for environment variables
console.log("Checking environment variables...")
const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"]

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])
if (missingEnvVars.length > 0) {
  console.warn("Warning: Missing environment variables:", missingEnvVars.join(", "))
  console.warn("Make sure these are set in your deployment environment.")
}

console.log("Pre-deployment checks complete!")
