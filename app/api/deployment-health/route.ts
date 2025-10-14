import { NextResponse } from "next/server"
import fs from "fs"

export async function GET() {
  try {
    const healthChecks = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      mode: "static-data",
      checks: {
        server: true,
        staticData: true,
        envVariables: checkEnvironmentVariables(),
        database: await checkDatabaseConnection(),
        fileSystem: checkFileSystem(),
        dependencies: checkDependencies(),
      },
    }

    const allPassed = Object.values(healthChecks.checks).every((check) =>
      typeof check === "boolean" ? check : check.status === "ok",
    )

    return NextResponse.json(
      {
        status: allPassed ? "healthy" : "unhealthy",
        ...healthChecks,
      },
      { status: allPassed ? 200 : 503 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function checkEnvironmentVariables() {
  // Only check server-side environment variables
  const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return {
        status: "error",
        message: "Supabase credentials not configured",
      }
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: supabaseKey,
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
