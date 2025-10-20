/**
 * Global error handling utilities
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export function handleError(error: unknown): {
  message: string
  code?: string
  statusCode: number
} {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode || 500,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: 500,
    }
  }

  return {
    message: "An unexpected error occurred",
    statusCode: 500,
  }
}

export function logError(error: unknown, context?: Record<string, any>) {
  const timestamp = new Date().toISOString()

  if (error instanceof Error) {
    console.error(`[${timestamp}] Error:`, {
      message: error.message,
      stack: error.stack,
      context,
    })
  } else {
    console.error(`[${timestamp}] Unknown error:`, error, context)
  }
}

export async function safeAsyncOperation<T>(
  operation: () => Promise<T>,
  fallback: T,
  errorMessage?: string,
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    logError(error, { errorMessage })
    return fallback
  }
}
