const fs = require("fs")
const path = require("path")

// Function to recursively delete problematic modules
function deleteModule(modulePath) {
  if (!fs.existsSync(modulePath)) return

  try {
    console.log(`Attempting to delete: ${modulePath}`)
    fs.rmSync(modulePath, { recursive: true, force: true })
    console.log(`Successfully deleted: ${modulePath}`)
  } catch (error) {
    console.error(`Failed to delete ${modulePath}:`, error)
  }
}

// Main function
function main() {
  console.log("Running fix-deps script...")

  const nodeModulesPath = path.join(process.cwd(), "node_modules")

  // List of problematic modules to remove
  const problematicModules = ["libpq", "pg-native", "node-gyp", "node-pre-gyp"]

  // Delete direct problematic modules
  problematicModules.forEach((mod) => {
    deleteModule(path.join(nodeModulesPath, mod))
  })

  console.log("fix-deps script completed")
}

main()
