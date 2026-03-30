# Troubleshooting Guide - EL RACE Projects Mapping Application

## Issue: "Invalid src prop" Image Error

### Error Message
```
Invalid src prop (https://picsum.photos/600/400?random=2) on `next/image`, 
hostname "picsum.photos" is not configured under images in your `next.config.js`
```

### Cause
This is a **build cache issue**. The configuration is already in `next.config.js`, but Next.js hasn't rebuilt with the new config.

### Solution

#### Quick Fix - Local Development:
```bash
# Delete the build cache
rm -rf .next

# Rebuild
npm run build

# Start the app
npm start
```

#### EC2 Deployment:
```bash
# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@YOUR_EC2_IP

# Navigate to your app directory
cd /path/to/your/app

# Run the cleanup script
bash CLEAR_CACHE_AND_REBUILD.sh

# Or manually:
rm -rf .next node_modules/.cache
npm cache clean --force
npm install
npm run build

# Restart your app (if using PM2)
pm2 restart elrace
# Or manually start:
npm start
```

---

## Issue: "Loading..." Screen Stuck

### Cause
The authentication system is unable to load. This happens when:
1. `.env.local` file is missing from EC2
2. Environment variables aren't set
3. localStorage isn't available

### Solution

#### Step 1: Verify Environment Variables
SSH into your EC2 instance and check:
```bash
# Check if env file exists
ls -la .env.local

# If not, create it with your values
nano .env.local
```

#### Step 2: Set Required Environment Variables
Add all these to your `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://cfeggyysgopkzygaitzw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_tfbqgeRZ-TsFNP67InEi9Q_IZu6oVa2
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmZWdneXlzZ29wa3p5Z2FpdHp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzczNTQxOSwiZXhwIjoyMDg5MzExNDE5fQ.TeZkTGZHz6pmj7vGuWiGiZJ5Il0r9M88fquJizWSTtk

# Database
POSTGRES_URL=postgres://postgres.pbqfgjzvclwgxgvuzmul:lOxrvMkSnvagpt8i@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
POSTGRES_URL_NON_POOLING=postgres://postgres.pbqfgjzvclwgxgvuzmul:lOxrvMkSnvagpt8i@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
POSTGRES_PRISMA_URL=postgres://postgres.pbqfgjzvclwgxgvuzmul:lOxrvMkSnvagpt8i@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x
POSTGRES_HOST=db.pbqfgjzvclwgxgvuzmul.supabase.co
POSTGRES_PASSWORD=lOxrvMkSnvagpt8i

# Mapbox
MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiYXppenVsbGFoMjYxMSIsImEiOiJjbWJzeDkxMDMwd3JhMmtzZHd0Ym9sZm44In0.V2TEaa53IsuNBxLXm4SXSg

# Other
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_tfbqgeRZ-TsFNP67InEi9Q_IZu6oVa2
SSO_API_KEY=rcc0085_map_security
```

#### Step 3: Check Browser Console
Open Developer Tools (F12) and look for logs starting with `[v0]`:
- `[v0] Auth check - Token exists: true/false` - Shows if token is found
- `[v0] Loading timeout - forcing to login page` - Timeout occurred
- `[v0] Redirecting to login` - Navigation is working

### How to Check Logs

**In Browser:**
```
Press F12 → Console tab → Look for [v0] prefix messages
```

**On EC2 (if using PM2):**
```bash
pm2 logs elrace
```

**On EC2 (direct npm start):**
Logs appear in your terminal window

---

## Issue: Login Page Not Appearing

### Default Credentials
```
Username: elrace
Password: Elrace1122
```

### If Login Doesn't Work

1. **Check browser console** for error messages (F12 → Console)
2. **Verify environment is correct** by visiting:
   ```
   http://your-ec2-ip:3000/api/env-check
   ```
   Should show which env vars are set.

3. **Check if localStorage is enabled:**
   - F12 → Application → LocalStorage
   - Should see entries after successful login

---

## Issue: Mapbox Not Loading

### Check Mapbox Token
```bash
# On EC2, verify the token is set
echo $MAPBOX_ACCESS_TOKEN
```

Should output: `pk.eyJ1IjoiYXppenVsbGFoMjYxMSIsImEiOiJjbWJzeDkxMDMwd3JhMmtzZHd0Ym9sZm44In0.V2TEaa53IsuNBxLXm4SXSg`

### Solutions
1. Verify token in `.env.local`
2. Restart the application after updating
3. Check browser console for Mapbox API errors (F12 → Console)

---

## Quick EC2 Setup Checklist

- [ ] SSH into EC2 instance
- [ ] Clone/pull the latest code
- [ ] Create `.env.local` file with all variables
- [ ] Run `npm install`
- [ ] Run `npm run build`
- [ ] Run `npm start` or `pm2 start npm --name elrace -- start`
- [ ] Visit `http://your-ec2-ip:3000`
- [ ] Verify login page loads
- [ ] Check browser console for any `[v0]` errors
- [ ] Try logging in with credentials: `elrace` / `Elrace1122`

---

## Debug Commands

```bash
# Check if .next folder exists (indicates build completed)
ls -la .next/

# Check Node version
node --version

# Check npm version
npm --version

# Test if server is running on port 3000
curl http://localhost:3000

# View recent PM2 logs
pm2 logs --lines 50

# Restart app
pm2 restart elrace

# Stop app
pm2 stop elrace

# Start app
pm2 start npm --name elrace -- start
```

---

## Still Having Issues?

1. **Clear everything and start fresh:**
   ```bash
   rm -rf .next node_modules package-lock.json
   npm install
   npm run build
   npm start
   ```

2. **Check the `.env.local` file:**
   ```bash
   cat .env.local  # View content
   wc -l .env.local  # Should have 10+ lines
   ```

3. **Test connection to Supabase:**
   Visit: `http://your-ec2-ip:3000/api/env-check`

4. **Check security groups:**
   - Ensure EC2 security group allows inbound on port 3000
   - Rule: `TCP 3000 from 0.0.0.0/0`

5. **Free up disk space:**
   ```bash
   df -h  # Check disk usage
   npm cache clean --force
   ```
