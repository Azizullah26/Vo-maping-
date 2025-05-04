import { getDatabaseClient } from "./db-client"
import { isDatabaseConfigured } from "./database-config"

// Default cache expiration time in seconds (5 minutes)
const DEFAULT_EXPIRATION = 300

/**
 * Set a value in the cache
 */
export async function setCache(
  key: string,
  value: any,
  expireInSeconds: number = DEFAULT_EXPIRATION,
): Promise<boolean> {
  if (!isDatabaseConfigured("redis")) {
    console.warn("Redis is not configured, cache operation skipped")
    return false
  }

  try {
    const redis = getDatabaseClient("redis")
    if (!redis) return false

    await redis.set(key, JSON.stringify(value), { ex: expireInSeconds })
    return true
  } catch (error) {
    console.error("Error setting cache:", error)
    return false
  }
}

/**
 * Get a value from the cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  if (!isDatabaseConfigured("redis")) {
    console.warn("Redis is not configured, cache operation skipped")
    return null
  }

  try {
    const redis = getDatabaseClient("redis")
    if (!redis) return null

    const value = await redis.get(key)
    if (!value) return null

    return JSON.parse(value as string) as T
  } catch (error) {
    console.error("Error getting cache:", error)
    return null
  }
}

/**
 * Delete a value from the cache
 */
export async function deleteCache(key: string): Promise<boolean> {
  if (!isDatabaseConfigured("redis")) {
    console.warn("Redis is not configured, cache operation skipped")
    return false
  }

  try {
    const redis = getDatabaseClient("redis")
    if (!redis) return false

    await redis.del(key)
    return true
  } catch (error) {
    console.error("Error deleting cache:", error)
    return false
  }
}

/**
 * Get a cached value or compute it if not in cache
 */
export async function getCachedOrCompute<T>(
  key: string,
  computeFn: () => Promise<T>,
  expireInSeconds: number = DEFAULT_EXPIRATION,
): Promise<T> {
  // Try to get from cache first
  const cachedValue = await getCache<T>(key)
  if (cachedValue !== null) {
    return cachedValue
  }

  // If not in cache, compute the value
  const computedValue = await computeFn()

  // Store in cache for future use
  await setCache(key, computedValue, expireInSeconds)

  return computedValue
}
