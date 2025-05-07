// Add server-side only marker to ensure this file only runs on the server
"use server"

import { getRedisClient } from "./db-client"
import { getDatabaseForFeature } from "./database-config"

/**
 * Set a value in the cache
 */
export async function setCache(key: string, value: any, expirationSeconds?: number): Promise<boolean> {
  try {
    const cacheType = getDatabaseForFeature("cache")

    if (cacheType === "redis") {
      const redis = getRedisClient()
      if (!redis) return false

      if (expirationSeconds) {
        await redis.set(key, JSON.stringify(value), { ex: expirationSeconds })
      } else {
        await redis.set(key, JSON.stringify(value))
      }
      return true
    }

    // Fallback implementation if Redis is not available
    // In a real app, you might use a different caching mechanism
    console.warn("Redis not available for caching, operation not performed")
    return false
  } catch (error) {
    console.error("Error setting cache:", error)
    return false
  }
}

/**
 * Get a value from the cache
 */
export async function getCache<T = any>(key: string): Promise<T | null> {
  try {
    const cacheType = getDatabaseForFeature("cache")

    if (cacheType === "redis") {
      const redis = getRedisClient()
      if (!redis) return null

      const value = await redis.get(key)
      if (!value) return null

      return JSON.parse(value as string) as T
    }

    // Fallback implementation
    console.warn("Redis not available for caching, operation not performed")
    return null
  } catch (error) {
    console.error("Error getting cache:", error)
    return null
  }
}

/**
 * Delete a value from the cache
 */
export async function deleteCache(key: string): Promise<boolean> {
  try {
    const cacheType = getDatabaseForFeature("cache")

    if (cacheType === "redis") {
      const redis = getRedisClient()
      if (!redis) return false

      await redis.del(key)
      return true
    }

    // Fallback implementation
    console.warn("Redis not available for caching, operation not performed")
    return false
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
  expireInSeconds = 300,
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
