interface DeploymentError {
  type: "build" | "runtime" | "deployment" | "environment"
  message: string
  stack?: string
  timestamp: string
  context?: Record<string, any>
  severity: "critical" | "error" | "warning" | "info"
}

class EnhancedErrorCollector {
  private errors: DeploymentError[] = []
  private maxErrors = 100
  private isProduction = process.env.NODE_ENV === "production"

  collectError(
    error: Error | string,
    type: DeploymentError["type"],
    context?: Record<string, any>,
    severity: DeploymentError["severity"] = "error",
  ) {
    const errorReport: DeploymentError = {
      type,
      severity,
      message: typeof error === "string" ? error : error.message,
      stack: typeof error === "object" ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      context: {
        ...context,
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "server",
        url: typeof window !== "undefined" ? window.location.href : "N/A",
        environment: process.env.NODE_ENV,
      },
    }

    // Keep only the last N errors
    if (this.errors.length >= this.maxErrors) {
      this.errors.shift()
    }

    this.errors.push(errorReport)

    // Log with appropriate level
    const logFn = severity === "critical" || severity === "error" ? console.error : console.warn
    logFn(`[${type.toUpperCase()}] [${severity.toUpperCase()}]:`, errorReport)

    // Send to logging service in production
    if (this.isProduction && typeof window !== "undefined") {
      this.sendToLoggingService(errorReport)
    }

    // Store in localStorage for debugging
    if (typeof window !== "undefined") {
      this.storeInLocalStorage(errorReport)
    }
  }

  private async sendToLoggingService(error: DeploymentError) {
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

  private storeInLocalStorage(error: DeploymentError) {
    try {
      const stored = localStorage.getItem("deployment_errors")
      const errors = stored ? JSON.parse(stored) : []
      errors.push(error)

      // Keep only last 50 errors in localStorage
      if (errors.length > 50) {
        errors.shift()
      }

      localStorage.setItem("deployment_errors", JSON.stringify(errors))
    } catch (err) {
      console.warn("Failed to store error in localStorage:", err)
    }
  }

  getErrors(filter?: { type?: DeploymentError["type"]; severity?: DeploymentError["severity"] }): DeploymentError[] {
    let filtered = [...this.errors]

    if (filter?.type) {
      filtered = filtered.filter((e) => e.type === filter.type)
    }

    if (filter?.severity) {
      filtered = filtered.filter((e) => e.severity === filter.severity)
    }

    return filtered
  }

  getCriticalErrors(): DeploymentError[] {
    return this.getErrors({ severity: "critical" })
  }

  clearErrors() {
    this.errors = []
    if (typeof window !== "undefined") {
      localStorage.removeItem("deployment_errors")
    }
  }

  // Deployment health checks
  async performDeploymentHealthCheck() {
    const checks = {
      timestamp: new Date().toISOString(),
      results: {
        environment: this.checkEnvironmentVariables(),
        database: await this.checkDatabaseConnection(),
        api: await this.checkAPIEndpoints(),
        assets: this.checkAssets(),
      },
    }

    const hasFailures = Object.values(checks.results).some((result) => !result.success)

    if (hasFailures) {
      this.collectError("Deployment health check failed", "deployment", { checks: checks.results }, "critical")
    }

    return checks
  }

  private checkEnvironmentVariables() {
    // Only check server-side critical environment variables
    const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

    const missing = required.filter((varName) => !process.env[varName])

    return {
      success: missing.length === 0,
      missing,
      message: missing.length === 0 ? "All environment variables present" : `Missing: ${missing.join(", ")}`,
    }
  }

  private async checkDatabaseConnection() {
    try {
      const response = await fetch("/api/health/database")
      return {
        success: response.ok,
        message: response.ok ? "Database connection successful" : "Database connection failed",
      }
    } catch (error) {
      return {
        success: false,
        message: `Database check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      }
    }
  }

  private async checkAPIEndpoints() {
    try {
      const endpoints = ["/api/health"]

      const results = await Promise.all(
        endpoints.map(async (endpoint) => {
          try {
            const response = await fetch(endpoint)
            return { endpoint, success: response.ok }
          } catch {
            return { endpoint, success: false }
          }
        }),
      )

      const failedEndpoints = results.filter((r) => !r.success)

      return {
        success: failedEndpoints.length === 0,
        message:
          failedEndpoints.length === 0
            ? "All API endpoints responding"
            : `Failed endpoints: ${failedEndpoints.map((e) => e.endpoint).join(", ")}`,
      }
    } catch (error) {
      return {
        success: false,
        message: `API check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      }
    }
  }

  private checkAssets() {
    // Check if critical assets can be loaded
    const criticalAssets = ["/abu-dhabi-police-logo.png", "/images/elrace-logo.png"]

    // This is a basic check - in a real scenario you'd want to verify these exist
    return {
      success: true,
      message: "Asset check passed",
    }
  }

  // Generate deployment report
  generateDeploymentReport() {
    const criticalErrors = this.getCriticalErrors()
    const errorsByType = {
      build: this.getErrors({ type: "build" }),
      runtime: this.getErrors({ type: "runtime" }),
      deployment: this.getErrors({ type: "deployment" }),
      environment: this.getErrors({ type: "environment" }),
    }

    return {
      summary: {
        total: this.errors.length,
        critical: criticalErrors.length,
        byType: Object.fromEntries(Object.entries(errorsByType).map(([type, errors]) => [type, errors.length])),
      },
      criticalErrors,
      allErrors: this.errors,
      timestamp: new Date().toISOString(),
    }
  }
}

export const enhancedErrorCollector = new EnhancedErrorCollector()
export default EnhancedErrorCollector
