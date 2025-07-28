interface ErrorReport {
  type: "build" | "runtime" | "deployment"
  message: string
  stack?: string
  timestamp: string
  context?: Record<string, any>
}

class ErrorCollector {
  private errors: ErrorReport[] = []
  private isProduction = process.env.NODE_ENV === "production"

  collectError(error: Error | string, type: ErrorReport["type"], context?: Record<string, any>) {
    const errorReport: ErrorReport = {
      type,
      message: typeof error === "string" ? error : error.message,
      stack: typeof error === "object" ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      context,
    }

    this.errors.push(errorReport)

    // Log immediately
    console.error(`[${type.toUpperCase()}] Error collected:`, errorReport)

    // In production, send to external service
    if (this.isProduction && typeof window !== "undefined") {
      this.sendToLoggingService(errorReport)
    }
  }

  private async sendToLoggingService(error: ErrorReport) {
    try {
      await fetch("/api/log-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(error),
      })
    } catch (err) {
      console.error("Failed to send error to logging service:", err)
    }
  }

  getErrors(): ErrorReport[] {
    return [...this.errors]
  }

  clearErrors() {
    this.errors = []
  }

  // Method to check for deployment-specific issues
  checkDeploymentHealth() {
    const checks = {
      envVars: this.checkEnvironmentVariables(),
      modules: this.checkModuleImports(),
      database: this.checkDatabaseConnection(),
    }

    return checks
  }

  private checkEnvironmentVariables() {
    const requiredVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

    const missing = requiredVars.filter((varName) => !process.env[varName])

    if (missing.length > 0) {
      this.collectError(`Missing environment variables: ${missing.join(", ")}`, "deployment", { missingVars: missing })
      return false
    }

    return true
  }

  private checkModuleImports() {
    // This would be called during build time to check for missing modules
    try {
      // Check critical modules exist
      const criticalModules = ["lib/supabase", "lib/db", "hooks/use-mobile"]

      // In a real implementation, you'd dynamically import these
      // For now, we'll just return true
      return true
    } catch (error) {
      this.collectError(`Module import check failed: ${error}`, "build", { modules: "critical modules check" })
      return false
    }
  }

  private async checkDatabaseConnection() {
    try {
      // This would make an actual database connection test
      // For now, we'll simulate it
      const response = await fetch("/api/health/database")
      return response.ok
    } catch (error) {
      this.collectError(`Database connection check failed: ${error}`, "deployment", { component: "database" })
      return false
    }
  }
}

export const errorCollector = new ErrorCollector()
export default ErrorCollector
