// This script fixes invalid unicode escape sequences in the codebase
const fs = require("fs")
const path = require("path")
const glob = require("glob")

// Function to fix unicode escapes in a file
function fixUnicodeEscapes(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8")

    // Replace invalid unicode escapes with proper ones
    // This regex finds \u not followed by exactly 4 hex digits
    const fixedContent = content.replace(/\\u(?![0-9a-fA-F]{4})/g, "\\\\u")

    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, "utf8")
      console.log(`Fixed unicode escapes in: ${filePath}`)
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error)
  }
}

// Find all JavaScript and TypeScript files
const files = glob.sync("**/*.{js,jsx,ts,tsx}", {
  ignore: ["node_modules/**", ".next/**", "out/**"],
})

// Process each file
files.forEach(fixUnicodeEscapes)

console.log("Unicode escape fixing complete!")
