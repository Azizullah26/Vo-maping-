# EC2 Deployment Guide - ELRACE Projects

## Common Issues & Solutions

### 1. **"Loading..." Screen Stuck Issue**

**Symptoms:**
- Page shows "Loading..." indefinitely
- Browser console shows no errors
- Network tab shows no failed requests

**Root Causes:**
- `.env.local` file not copied to EC2 instance
- Environment variables not set in EC2
- localStorage not initialized properly
- Supabase connection failing silently

**Solutions:**

#### Option A: Using Environment Variables on EC2
```bash
# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Set environment variables in ~/.bashrc or ~/.bash_profile
export NEXT_PUBLIC_SUPABASE_URL="https://cfeggyysgopkzygaitzw.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_tfbqgeRZ-TsFNP67InEi9Q_IZu6oVa2"
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmZWdneXlzZ29wa3p5Z2FpdHp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzczNTQxOSwiZXhwIjoyMDg5MzExNDE5fQ.TeZkTGZHz6pmj7vGuWiGiZJ5Il0r9M88fquJizWSTtk"
export POSTGRES_URL_NON_POOLING="postgres://postgres.pbqfgjzvclwgxgvuzmul:lOxrvMkSnvagpt8i@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
export MAPBOX_ACCESS_TOKEN="pk.eyJ1IjoiYXppenVsbGFoMjYxMSIsImEiOiJjbWJzeDkxMDMwa3JhMmtzZHd0Ym9sZm44In0.V2TEaa53IsuNBxLXm4SXSg"
export CESIUM_ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
export POSTGRES_HOST="db.pbqfgjzvclwgxgvuzmul.supabase.co"
export POSTGRES_PASSWORD="lOxrvMkSnvagpt8i"
export POSTGRES_PRISMA_URL="postgres://postgres.pbqfgjzvclwgxgvuzmul:lOxrvMkSnvagpt8i@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
export POSTGRES_URL="postgres://postgres.pbqfgjzvclwgxgvuzmul:lOxrvMkSnvagpt8i@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"

# Then reload
source ~/.bashrc
```

#### Option B: Copy .env.local File to EC2
```bash
# From your local machine
scp -i your-key.pem /path/to/.env.local ec2-user@your-ec2-ip:/home/ec2-user/app/.env.local

# On EC2 instance, move it to the app directory
mv /home/ec2-user/app/.env.local /var/www/elrace-projects/.env.local
chmod 600 /var/www/elrace-projects/.env.local
```

#### Option C: Using Docker with Environment Variables
```bash
# Start container with env file
docker run -d \
  --env-file .env.local \
  -p 3000:3000 \
  elrace-projects:latest
```

---

### 2. **Mapbox Not Loading**

**Symptoms:**
- Map shows blank gray area
- Mapbox GL JS library fails to load
- Console shows 401 or 403 errors from Mapbox

**Solutions:**
```bash
# Check if Mapbox token is set
echo $MAPBOX_ACCESS_TOKEN

# Verify token is correct
# The token should start with "pk.eyJ..."

# Restart the application after setting token
npm run build
npm start
```

---

### 3. **Login Page Not Loading**

**Symptoms:**
- Login page shows "Loading..." instead of form
- Can't see username/password inputs

**Solutions:**

**Step 1: Check browser console**
```javascript
// Open browser DevTools (F12)
// Check Console tab for any errors
// You should see [v0] debug logs like:
// "[v0] Auth check - Token exists: false Expiry exists: false"
```

**Step 2: Clear localStorage**
```javascript
// In browser console
localStorage.clear()
location.reload()
```

**Step 3: Check network requests**
- Open DevTools → Network tab
- Reload page
- Look for failed requests to Supabase or API endpoints
- Check if requests are being blocked (CORS issues)

---

### 4. **Image Loading Errors**

**Symptoms:**
```
Invalid src prop (https://picsum.photos/600/400?random=2) on `next/image`, 
hostname "picsum.photos" is not configured under images in your `next.config.js`
```

**Solution:** Already fixed - `picsum.photos` is configured in `next.config.js`

If you still see this:
1. Clear browser cache: Ctrl+Shift+Delete
2. Clear Next.js cache on server:
   ```bash
   rm -rf .next
   npm run build
   npm start
   ```

---

### 5. **Database Connection Issues**

**Symptoms:**
- "Loading..." never completes
- Console shows Supabase connection errors

**Verify Connection:**
```bash
# SSH to EC2 and test the connection
curl -X GET "https://cfeggyysgopkzygaitzw.supabase.co/auth/v1/health" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY"

# Should return HTTP 200 OK
```

---

## EC2 Setup Checklist

- [ ] Node.js 18+ installed: `node --version`
- [ ] npm/yarn installed: `npm --version`
- [ ] `.env.local` file copied or env vars set
- [ ] Port 3000 (or your port) open in Security Group
- [ ] HTTPS configured (if needed)
- [ ] PM2 or systemd service configured for auto-restart
- [ ] Firewall allows outbound HTTPS (to Supabase, Mapbox APIs)

---

## Deployment Commands

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start in production mode
npm start

# Or use PM2 for production
pm2 start npm --name "elrace" -- start
pm2 startup
pm2 save
```

---

## Security Group Rules for EC2

Allow inbound traffic:
- **HTTP** (80) - from anywhere (for Let's Encrypt if using HTTPS)
- **HTTPS** (443) - from anywhere
- **SSH** (22) - from your IP only
- **Custom TCP** (3000) - from anywhere (if running on port 3000)

Allow outbound traffic:
- **All traffic** (required for Supabase, Mapbox API calls)

---

## Debugging in Browser Console

The app now includes enhanced logging. Look for `[v0]` prefixed logs:

```javascript
[v0] Auth check - Token exists: false Expiry exists: false
[v0] AuthGuard state: { isAuthenticated: false, isLoading: false, pathname: '/' }
[v0] Redirecting to login
```

---

## Default Credentials

**Username:** `elrace`
**Password:** `Elrace1122`

---

## Still Having Issues?

1. Check browser console for `[v0]` debug logs
2. Check server logs: `pm2 logs elrace`
3. Check nginx logs if using reverse proxy: `tail -f /var/log/nginx/error.log`
4. Verify all environment variables are set: `env | grep NEXT_PUBLIC`
5. Try clearing `.next` cache and rebuilding
