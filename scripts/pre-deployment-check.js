const fs = require("fs")
const path = require("path")

console.log("🔍 Running pre-deployment checks...")

const errors = []
const warnings = []

// Check 1: Environment variables template
function checkEnvTemplate() {
  // Only check server-side critical environment variables
  const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

  console.log("\n📋 Checking environment variables...")

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      warnings.push(`Environment variable ${varName} is not set`)
    } else {
      console.log(`✅ ${varName} is set`)
    }
  })
}

// Check 2: Critical files exist
function checkCriticalFiles() {
  console.log("\n📁 Checking critical files...")

  const criticalFiles = [
    "package.json",
    "next.config.js",
    "tsconfig.json",
    "app/layout.tsx",
    "app/page.tsx",
    "tailwind.config.ts",
  ]

  criticalFiles.forEach((file) => {
    if (!fs.existsSync(path.join(process.cwd(), file))) {
      errors.push(`Critical file missing: ${file}`)
    } else {
      console.log(`✅ ${file} exists`)
    }
  })
}

// Check 3: package.json validity
function checkPackageJson() {
  console.log("\n📦 Checking package.json...")

  try {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))

    if (!packageJson.scripts?.build) {
      errors.push("package.json missing 'build' script")
    } else {
      console.log("✅ Build script exists")
    }

    if (!packageJson.dependencies?.next) {
      errors.push("package.json missing 'next' dependency")
    } else {
      console.log("✅ Next.js dependency exists")
    }
  } catch (error) {
    errors.push(`Failed to parse package.json: ${error.message}`)
  }
}

// Check 4: TypeScript configuration
function checkTypeScriptConfig() {
  console.log("\n⚙️  Checking TypeScript configuration...")

  try {
    const tsConfig = JSON.parse(fs.readFileSync("tsconfig.json", "utf8"))

    if (!tsConfig.compilerOptions) {
      warnings.push("tsconfig.json missing compilerOptions")
    } else {
      console.log("✅ TypeScript configuration valid")
    }
  } catch (error) {
    warnings.push(`TypeScript config check failed: ${error.message}`)
  }
}

// Check 5: Next.js configuration
function checkNextConfig() {
  console.log("\n⚙️  Checking Next.js configuration...")

  try {
    require("./next.config.js")
    console.log("✅ Next.js configuration valid")
  } catch (error) {
    errors.push(`Next.js config error: ${error.message}`)
  }
}

// Run all checks
checkEnvTemplate()
checkCriticalFiles()
checkPackageJson()
checkTypeScriptConfig()
checkNextConfig()

// Report results
console.log("\n" + "=".repeat(50))
console.log("📊 Pre-deployment Check Results")
console.log("=".repeat(50))

if (errors.length === 0 && warnings.length === 0) {
  console.log("✅ All checks passed! Ready for deployment.")
  process.exit(0)
}

if (warnings.length > 0) {
  console.log("\n⚠️  Warnings:")
  warnings.forEach((warning) => console.log(`   - ${warning}`))
}

if (errors.length > 0) {
  console.log("\n❌ Errors:")
  errors.forEach((error) => console.log(`   - ${error}`))
  console.log("\n❌ Deployment check failed. Please fix errors before deploying.")
  process.exit(1)
}

if (warnings.length > 0) {
  console.log("\n⚠️  Deployment can proceed but warnings should be addressed.")
  process.exit(0)
}
