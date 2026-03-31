import fs from 'fs'
import path from 'path'

/**
 * Loads environment variables from .env.local file
 * This is a workaround for v0 environment not automatically reading .env.local
 */
export function loadEnvFile() {
  try {
    // Try multiple possible locations
    const possiblePaths = [
      path.join(process.cwd(), '.env.local'),
      path.join(process.cwd(), '..', '.env.local'),
      '/vercel/share/v0-project/.env.local',
      '/vercel/share/v0-next-shadcn/.env.local',
      path.resolve(__dirname, '../../.env.local'),
    ]

    let envLocalPath = null
    let envContent = null

    // Find the first existing .env.local file
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        console.log('[v0] Found .env.local at:', possiblePath)
        envLocalPath = possiblePath
        envContent = fs.readFileSync(possiblePath, 'utf-8')
        break
      }
    }

    if (!envContent) {
      console.log('[v0] .env.local file not found in any of these locations:')
      possiblePaths.forEach(p => console.log('[v0]   -', p))
      return
    }

    // Parse and load each line
    const lines = envContent.split('\n')
    let loadedCount = 0

    for (const line of lines) {
      // Skip empty lines and comments
      if (!line || line.startsWith('#')) continue

      // Parse key=value
      const [key, ...valueParts] = line.split('=')
      const cleanKey = key.trim()
      const value = valueParts.join('=').trim()

      if (cleanKey && value) {
        // Only set if not already set by system environment
        if (!process.env[cleanKey]) {
          process.env[cleanKey] = value
          loadedCount++
          console.log(`[v0] Loaded env var: ${cleanKey}`)
        } else {
          console.log(`[v0] Env var already set (skipped): ${cleanKey}`)
        }
      }
    }

    console.log(`[v0] Successfully loaded ${loadedCount} environment variables from .env.local`)
    console.log(`[v0] MAPBOX_ACCESS_TOKEN is now: ${process.env.MAPBOX_ACCESS_TOKEN ? 'SET' : 'NOT SET'}`)
  } catch (error) {
    console.error('[v0] Error loading .env.local file:', error)
  }
}
