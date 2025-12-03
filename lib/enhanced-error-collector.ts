// Enhanced error collection with categorization and reporting

interface EnhancedError {
  id: string
  message: string
  stack?: string
  category: "network" | "validation" | "runtime" | "other"
  severity: "low" | "medium" | "high" | "critical"
  timestamp: string
  context?: Record<string, any>
  userAgent?: string
  url?: string
}

class EnhancedErrorCollector {
  private errors: EnhancedError[] = []
  private maxErrors = 200

  collectError(
    error: Error,
    category: EnhancedError["category"] = "other",
    severity: EnhancedError["severity"] = "medium",
    context?: Record<string, any>,
  ) {
    const enhancedError: EnhancedError = {
      id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: error.message,
      stack: error.stack,
      category,
      severity,
      timestamp: new Date().toISOString(),
      context,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      url: typeof window !== "undefined" ? window.location.href : undefined,
    }

    this.errors.push(enhancedError)

    if (this.errors.length > this.maxErrors) {
      this.errors.shift()
    }

    // Log critical errors immediately
    if (severity === "critical") {
      console.error("CRITICAL ERROR:", enhancedError)
    }
  }

  getErrors(filter?: {
    category?: EnhancedError["category"]
    severity?: EnhancedError["severity"]
    since?: Date
  }): EnhancedError[] {
    let filtered = [...this.errors]

    if (filter?.category) {
      filtered = filtered.filter((e) => e.category === filter.category)
    }

    if (filter?.severity) {
      filtered = filtered.filter((e) => e.severity === filter.severity)
    }

    if (filter?.since) {
      const sinceTime = filter.since.getTime()
      filtered = filtered.filter((e) => new Date(e.timestamp).getTime() >= sinceTime)
    }

    return filtered
  }

  getCategoryCounts() {
    const counts = {
      network: 0,
      validation: 0,
      runtime: 0,
      other: 0,
    }

    this.errors.forEach((error) => {
      counts[error.category]++
    })

    return counts
  }

  getSeverityCounts() {
    const counts = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    }

    this.errors.forEach((error) => {
      counts[error.severity]++
    })

    return counts
  }

  clearErrors() {
    this.errors = []
  }

  exportErrors(): string {
    return JSON.stringify(this.errors, null, 2)
  }
}

let _enhancedErrorCollector: EnhancedErrorCollector | null = null

function getEnhancedErrorCollector(): EnhancedErrorCollector {
  if (!_enhancedErrorCollector) {
    _enhancedErrorCollector = new EnhancedErrorCollector()
  }
  return _enhancedErrorCollector
}

// Keep backwards compatibility with a proxy object
export const enhancedErrorCollector = {
  collectError: (
    error: Error,
    category?: EnhancedError["category"],
    severity?: EnhancedError["severity"],
    context?: Record<string, any>,
  ) => getEnhancedErrorCollector().collectError(error, category, severity, context),
  getErrors: (filter?: Parameters<EnhancedErrorCollector["getErrors"]>[0]) =>
    getEnhancedErrorCollector().getErrors(filter),
  getCategoryCounts: () => getEnhancedErrorCollector().getCategoryCounts(),
  getSeverityCounts: () => getEnhancedErrorCollector().getSeverityCounts(),
  clearErrors: () => getEnhancedErrorCollector().clearErrors(),
  exportErrors: () => getEnhancedErrorCollector().exportErrors(),
}

export function collectError(
  error: Error,
  category?: EnhancedError["category"],
  severity?: EnhancedError["severity"],
  context?: Record<string, any>,
) {
  getEnhancedErrorCollector().collectError(error, category, severity, context)
}

export function getEnhancedErrors(filter?: Parameters<EnhancedErrorCollector["getErrors"]>[0]) {
  return getEnhancedErrorCollector().getErrors(filter)
}

export function getErrorStats() {
  const collector = getEnhancedErrorCollector()
  return {
    byCategory: collector.getCategoryCounts(),
    bySeverity: collector.getSeverityCounts(),
    total: collector.getErrors().length,
  }
}
