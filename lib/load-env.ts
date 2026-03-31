import fs from 'fs'
import path from 'path'

/**
 * Loads environment variables from .env.local file
 * This is a workaround for v0 environment not automatically reading .env.local
 */
export function loadEnvFile() {
  try {
    const envLocalPath = path.join(process.cwd(), '.env.local')
    
    // Check if .env.local exists
    if (!fs.existsSync(envLocalPath)) {
      console.log('[v0] .env.local file not found at:', envLocalPath)
      return
    }

    // Read the file
    const envContent = fs.readFileSync(envLocalPath, 'utf-8')
    
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
        }
      }
    }

    console.log(`[v0] Successfully loaded ${loadedCount} environment variables from .env.local`)
  } catch (error) {
    console.error('[v0] Error loading .env.local file:', error)
  }
}
