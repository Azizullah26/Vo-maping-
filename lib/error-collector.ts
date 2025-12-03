// Error collection and monitoring system

interface ErrorLog {
  message: string
  stack?: string
  timestamp: string
  context?: Record<string, any>
}

class ErrorCollector {
  private errors: ErrorLog[] = []
  private maxErrors = 100

  logError(error: Error, context?: Record<string, any>) {
    const errorLog: ErrorLog = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
    }

    this.errors.push(errorLog)

    // Keep only last maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift()
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error logged:", errorLog)
    }
  }

  getErrors(): ErrorLog[] {
    return [...this.errors]
  }

  clearErrors() {
    this.errors = []
  }

  getErrorCount(): number {
    return this.errors.length
  }
}

let _errorCollector: ErrorCollector | null = null

function getErrorCollector(): ErrorCollector {
  if (!_errorCollector) {
    _errorCollector = new ErrorCollector()
  }
  return _errorCollector
}

// Keep backwards compatibility with a proxy object
export const errorCollector = {
  logError: (error: Error, context?: Record<string, any>) => getErrorCollector().logError(error, context),
  getErrors: () => getErrorCollector().getErrors(),
  clearErrors: () => getErrorCollector().clearErrors(),
  getErrorCount: () => getErrorCollector().getErrorCount(),
}

export function logError(error: Error, context?: Record<string, any>) {
  getErrorCollector().logError(error, context)
}

export function getErrorLogs() {
  return getErrorCollector().getErrors()
}

export function clearErrorLogs() {
  getErrorCollector().clearErrors()
}
