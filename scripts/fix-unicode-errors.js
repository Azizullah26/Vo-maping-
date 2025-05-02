const fs = require("fs")
const path = require("path")

// Function to recursively find all .js, .jsx, .ts, and .tsx files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      findFiles(filePath, fileList)
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      fileList.push(filePath)
    }
  })

  return fileList
}

// Function to fix common unicode escape errors
function fixUnicodeEscapes(content) {
  // Replace invalid unicode escapes like \u followed by non-hex characters
  return (
    content
      // Fix incomplete unicode escapes
      .replace(/\\u([0-9a-fA-F]{0,3})(?=[^0-9a-fA-F]|$)/g, (match, p1) => {
        console.log(`Fixed incomplete unicode escape: ${match}`)
        return `\\u${p1.padEnd(4, "0")}`
      })
      // Fix unicode escapes with invalid hex characters
      .replace(/\\u([^0-9a-fA-F{])/g, (match, p1) => {
        console.log(`Fixed invalid unicode escape: ${match}`)
        return `\\\\u${p1}`
      })
      // Fix escaped backslashes before u that aren't actually unicode escapes
      .replace(/\\\\u([^0-9a-fA-F])/g, (match, p1) => {
        console.log(`Fixed escaped backslash before u: ${match}`)
        return `\\\\u${p1}`
      })
  )
}

// Main function
function main() {
  try {
    // Find all JavaScript and TypeScript files
    const files = findFiles(".")

    // Process each file
    files.forEach((filePath) => {
      try {
        const content = fs.readFileSync(filePath, "utf8")
        const fixedContent = fixUnicodeEscapes(content)

        // Only write back if changes were made
        if (content !== fixedContent) {
          console.log(`Fixed unicode escapes in: ${filePath}`)
          fs.writeFileSync(filePath, fixedContent, "utf8")
        }
      } catch (err) {
        console.error(`Error processing file ${filePath}:`, err)
      }
    })

    console.log("Unicode escape fixing completed.")
  } catch (err) {
    console.error("Error:", err)
  }
}

main()
