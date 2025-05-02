import { Redis } from "@upstash/redis"

// Create a Redis client
let redisClient: Redis | null = null

export function getRedisClient() {
  if (!redisClient) {
    if (!process.env.KV_URL || !process.env.KV_REST_API_TOKEN) {
      console.error("Redis environment variables are not set")
      return null
    }

    redisClient = new Redis({
      url: process.env.KV_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  }

  return redisClient
}

// Set a value in Redis with optional expiration
export async function setCache(key: string, value: any, expireInSeconds?: number): Promise<boolean> {
  try {
    const redis = getRedisClient()
    if (!redis) {
      return false
    }

    if (expireInSeconds) {
      await redis.set(key, JSON.stringify(value), { ex: expireInSeconds })
    } else {
      await redis.set(key, JSON.stringify(value))
    }
    return true
  } catch (error) {
    console.error("Redis set error:", error)
    return false
  }
}

// Get a value from Redis
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const redis = getRedisClient()
    if (!redis) {
      return null
    }

    const value = await redis.get(key)
    if (!value) {
      return null
    }

    return JSON.parse(value as string) as T
  } catch (error) {
    console.error("Redis get error:", error)
    return null
  }
}

// Delete a value from Redis
export async function deleteCache(key: string): Promise<boolean> {
  try {
    const redis = getRedisClient()
    if (!redis) {
      return false
    }

    await redis.del(key)
    return true
  } catch (error) {
    console.error("Redis delete error:", error)
    return false
  }
}
