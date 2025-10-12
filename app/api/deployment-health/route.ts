import { NextResponse } from "next/server"

export async function GET() {
  const healthChecks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {
      envVariables: checkEnvironmentVariables(),
      database: await checkDatabaseConnection(),
      fileSystem: checkFileSystem(),
      dependencies: checkDependencies(),
    },
  }

  const allPassed = Object.values(healthChecks.checks).every((check) => check.status === "ok")

  return NextResponse.json(
    {
      status: allPassed ? "healthy" : "unhealthy",
      ...healthChecks,
    },
    { status: allPassed ? 200 : 503 },
  )
}

function checkEnvironmentVariables() {
  const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN"]

  const missing = required.filter((varName) => !process.env[varName])

  return {
    status: missing.length === 0 ? "ok" : "error",
    message: missing.length === 0 ? "All required environment variables present" : `Missing: ${missing.join(", ")}`,
    details: {
      required: required.length,
      present: required.length - missing.length,
      missing,
    },
  }
}

async function checkDatabaseConnection() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      },
    }).catch(() => null)

    return {
      status: response?.ok ? "ok" : "error",
      message: response?.ok ? "Database connection successful" : "Database connection failed",
    }
  } catch (error) {
    return {
      status: "error",
      message: `Database check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

function checkFileSystem() {
  try {
    // Check if critical directories exist
    const fs = require("fs")
    const criticalPaths = ["./public", "./app", "./components", "./lib"]

    const missing = criticalPaths.filter((path) => {
      try {
        return !fs.existsSync(path)
      } catch {
        return true
      }
    })

    return {
      status: missing.length === 0 ? "ok" : "error",
      message: missing.length === 0 ? "All critical paths exist" : `Missing paths: ${missing.join(", ")}`,
    }
  } catch (error) {
    return {
      status: "error",
      message: `File system check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

function checkDependencies() {
  try {
    const requiredModules = ["react", "next", "mapbox-gl", "@supabase/supabase-js"]

    const missing = requiredModules.filter((mod) => {
      try {
        require.resolve(mod)
        return false
      } catch {
        return true
      }
    })

    return {
      status: missing.length === 0 ? "ok" : "warning",
      message:
        missing.length === 0 ? "All critical dependencies available" : `Missing dependencies: ${missing.join(", ")}`,
    }
  } catch (error) {
    return {
      status: "error",
      message: `Dependency check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
