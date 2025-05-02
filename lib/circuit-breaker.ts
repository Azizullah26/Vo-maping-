/**
 * Simple circuit breaker implementation to prevent cascading failures
 */
export class CircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED"

  constructor(
    private readonly failureThreshold: number = 3,
    private readonly resetTimeout: number = 30000, // 30 seconds
    private readonly halfOpenTimeout: number = 10000, // 10 seconds
  ) {}

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>, fallback?: () => Promise<T>): Promise<T> {
    // If circuit is open, check if we should try half-open state
    if (this.state === "OPEN") {
      const now = Date.now()
      if (now - this.lastFailureTime > this.resetTimeout) {
        this.state = "HALF_OPEN"
        console.log("Circuit breaker state changed to HALF_OPEN")
      } else {
        // Circuit is still open, use fallback if provided
        if (fallback) {
          return fallback()
        }
        throw new Error("Circuit is OPEN")
      }
    }

    try {
      // Execute the function
      const result = await fn()

      // If we were in half-open state and succeeded, close the circuit
      if (this.state === "HALF_OPEN") {
        this.state = "CLOSED"
        this.failures = 0
        console.log("Circuit breaker state changed to CLOSED")
      }

      return result
    } catch (error) {
      // Record the failure
      this.failures++
      this.lastFailureTime = Date.now()

      // If we've reached the threshold, open the circuit
      if (this.state === "CLOSED" && this.failures >= this.failureThreshold) {
        this.state = "OPEN"
        console.log("Circuit breaker state changed to OPEN")
      }

      // If we were in half-open state and failed, open the circuit again
      if (this.state === "HALF_OPEN") {
        this.state = "OPEN"
        console.log("Circuit breaker state changed to OPEN after half-open failure")
      }

      // Use fallback if provided, otherwise rethrow
      if (fallback) {
        return fallback()
      }
      throw error
    }
  }

  /**
   * Get the current state of the circuit breaker
   */
  getState(): "CLOSED" | "OPEN" | "HALF_OPEN" {
    return this.state
  }

  /**
   * Reset the circuit breaker to closed state
   */
  reset(): void {
    this.state = "CLOSED"
    this.failures = 0
    this.lastFailureTime = 0
    console.log("Circuit breaker reset to CLOSED")
  }
}

// Create a singleton instance for database operations
export const dbCircuitBreaker = new CircuitBreaker()
