// Script to run the unicode fix
const { execSync } = require("child_process")

try {
  console.log("Running unicode escape sequence fix...")
  execSync("node scripts/fix-unicode-errors.js", { stdio: "inherit" })
  console.log("Unicode fix completed successfully")
} catch (error) {
  console.error("Error running unicode fix:", error.message)
  process.exit(1)
}
