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

export const errorCollector = new ErrorCollector()

export function logError(error: Error, context?: Record<string, any>) {
  errorCollector.logError(error, context)
}

export function getErrorLogs() {
  return errorCollector.getErrors()
}

export function clearErrorLogs() {
  errorCollector.clearErrors()
}
