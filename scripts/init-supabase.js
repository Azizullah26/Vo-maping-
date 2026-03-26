#!/usr/bin/env node

/**
 * Supabase Database Initialization Script
 * Run this script to set up your Supabase database tables
 */

const https = require('https');
const { execSync } = require('child_process');

// Get environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease set these in your Vercel project settings.');
  process.exit(1);
}

console.log('🚀 Initializing Supabase database...');
console.log(`📍 URL: ${SUPABASE_URL}`);

// Make HTTP request to the init endpoint
const initUrl = `${SUPABASE_URL.replace(/\/$/, '')}/api/init-supabase-tables`;

const makeRequest = (url, method = 'POST') => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
    };

    const protocol = url.startsWith('https') ? https : require('http');

    const req = protocol.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsedData });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify({}));
    req.end();
  });
};

makeRequest(initUrl)
  .then((response) => {
    if (response.status === 200 && response.data.success) {
      console.log('✅ Database initialized successfully!');
      console.log(response.data.message);
      process.exit(0);
    } else {
      console.error('❌ Database initialization failed:');
      console.error(response.data.message || 'Unknown error');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Error calling initialization endpoint:');
    console.error(error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Ensure your app is deployed to Vercel');
    console.error('2. Check that NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
    console.error('3. Try visiting: https://your-app-url/api/init-supabase-tables');
    process.exit(1);
  });
