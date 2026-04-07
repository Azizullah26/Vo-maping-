# Hub Team - SSO Integration Quick Start

**Last Updated:** March 27, 2026  
**Application Status:** ✅ LIVE (elracemap.vercel.app)  
**SSO Status:** ✅ FIXED & VERIFIED  

---

## Quick Facts

- ✅ **Login URL works** - Returns valid one-time login URL
- ✅ **No login page shown** - Users go directly to welcome page after SSO
- ✅ **Sessions persist** - 24-hour session duration
- ✅ **Single-use tokens** - 5-minute expiration, one-time use only
- ✅ **Live and tested** - Ready for hub team testing

---

## 5-Minute Integration

### Step 1: Get Your API Key

The API key: `rcc0085_map_security`

Store as environment variable on your hub server:
```bash
ELRACE_SSO_API_KEY=rcc0085_map_security
```

### Step 2: Create SSO Endpoint on Your Hub

**Node.js/Express Example:**
```javascript
app.post('/sso/elrace-login', async (req, res) => {
  const { userId } = req.body;
  
  // Call ELRACE SSO endpoint
  const response = await fetch('https://elracemap.vercel.app/api/sso/login-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.ELRACE_SSO_API_KEY,
      source: 'hub'
    })
  });

  const data = await response.json();
  
  if (data.success) {
    // Redirect user's browser
    res.redirect(302, data.login_url);
  } else {
    res.status(401).json({ error: data.error });
  }
});
```

**PHP Example:**
```php
$response = file_get_contents('https://elracemap.vercel.app/api/sso/login-url', false,
    stream_context_create([
        'http' => [
            'method'  => 'POST',
            'header'  => 'Content-Type: application/json',
            'content' => json_encode([
                'api_key' => getenv('ELRACE_SSO_API_KEY'),
                'source'  => 'hub'
            ])
        ]
    ])
);

$data = json_decode($response, true);

if ($data['success']) {
    header('Location: ' . $data['login_url']);
    exit;
}
```

**Python Example:**
```python
import requests
import os

@app.route('/sso/elrace-login', methods=['POST'])
def elrace_sso():
    response = requests.post(
        'https://elracemap.vercel.app/api/sso/login-url',
        json={
            'api_key': os.environ['ELRACE_SSO_API_KEY'],
            'source': 'hub'
        }
    )
    
    data = response.json()
    
    if data['success']:
        return redirect(data['login_url'])
    else:
        return {'error': data['error']}, 401
```

### Step 3: Add SSO Button to Your Hub

```html
<a href="/sso/elrace-login" class="btn btn-primary">
  Access ELRACE Projects Map
</a>
```

### Step 4: Test the Flow

1. Click the SSO button on your hub
2. Your hub server calls ELRACE `/api/sso/login-url`
3. User redirected to ELRACE login URL
4. User sees loading indicator
5. ✅ User redirected to welcome page (no login page!)
6. ✅ User can access ELRACE platform

---

## API Reference

### POST /api/sso/login-url

Generate a one-time login URL.

**Request:**
```json
{
  "api_key": "rcc0085_map_security",
  "source": "hub"
}
```

**Success Response:**
```json
{
  "success": true,
  "login_url": "https://elracemap.vercel.app/sso/callback?token=abc123xyz&source=hub",
  "token": "abc123xyz",
  "expires_in": 300,
  "expires_at": "2026-03-27T16:05:00.000Z"
}
```

**Error Responses:**
```json
// Invalid API key
{"success": false, "error": "Invalid or missing API key", "code": "INVALID_API_KEY"}

// Server error
{"success": false, "error": "Internal server error", "code": "SERVER_ERROR"}
```

### GET /sso/callback?token=xxx

**What happens automatically:**
1. ✅ Token validated
2. ✅ Session created
3. ✅ Auth stored
4. ✅ Redirect to /welcome
5. ✅ No login page shown

---

## Testing Checklist

- [ ] API key stored in environment variable
- [ ] SSO endpoint created on hub
- [ ] SSO button added to hub UI
- [ ] Test with invalid API key → Error message shown
- [ ] Test with valid API key → User redirected
- [ ] Verify user sees welcome page (not login page)
- [ ] Verify user can access ELRACE dashboard
- [ ] Test session persistence (refresh page)
- [ ] Test logout removes session

---

## Important Security Notes

1. **Never call `/api/sso/login-url` from frontend**
   - Always call from your hub backend (server-side)
   - API key must never be exposed to client

2. **Tokens are single-use**
   - Each token can only be used once
   - A token cannot be used at both `/sso/callback` and `/api/sso/verify`

3. **Tokens expire in 5 minutes**
   - Generate token immediately before redirecting user
   - If user takes more than 5 min, token will expire

4. **Sessions last 24 hours**
   - After 24 hours, user needs to re-authenticate
   - Session persists across browser refreshes

5. **Store API key securely**
   - Use environment variables
   - Never commit to Git
   - Never log the API key

---

## Troubleshooting

### Issue: "Invalid or missing API key"

**Check:**
- Is API key spelled correctly?
- Is it stored in environment variable?
- Are you calling from backend (not frontend)?

**Fix:**
```bash
# Verify your environment variable
echo $ELRACE_SSO_API_KEY

# Should output: rcc0085_map_security
```

### Issue: "Token not found or already expired"

**Check:**
- Did token expire? (5-minute limit)
- Was token already used?
- Is the token in the URL correct?

**Fix:**
- Generate a fresh token
- Make sure to redirect immediately
- Check browser console for errors

### Issue: User still sees login page

**This is FIXED!** If you're still seeing this:
- Clear browser cache/localStorage
- Try incognito/private window
- Check browser console for errors

### Issue: Redirect not working

**Check:**
- Is the login URL valid?
- Is browser following redirects?
- Are there console errors?

**Debug:**
```javascript
// In your redirect code, log the URL
console.log('Redirecting to:', loginUrl);
console.log('Response:', data);
```

---

## Optional: Server-Side Verification

For additional security, you can verify the token server-to-server:

**POST /api/sso/verify**

```bash
curl -X POST https://elracemap.vercel.app/api/sso/verify \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "rcc0085_map_security",
    "token": "abc123xyz"
  }'
```

**Response:**
```json
{
  "success": true,
  "session_token": "ZWxyYWNlOjE3NDE2OTkwMDA6YWJjMTIz",
  "expires_at": "2026-03-28T16:00:00.000Z",
  "user": {
    "username": "elrace",
    "role": "admin",
    "platform": "elrace-projects",
    "source": "hub"
  }
}
```

**Note:** Calling `/api/sso/verify` consumes the token - it cannot then be used at `/sso/callback`.

---

## Support

**Need help?** Contact the ELRACE Platform Team

**Documentation:**
- Full API Guide: https://elracemap.vercel.app/sso/docs
- Integration Guide: `https://elracemap.vercel.app/public/sso-integration-guide.md`
- Live App: https://elracemap.vercel.app

**Status Page:** Check https://elracemap.vercel.app for application status

---

## Summary

✅ **API is working** - Tokens generate successfully  
✅ **No login page bug** - Fixed and verified  
✅ **Sessions work** - 24-hour duration  
✅ **Ready to integrate** - Your hub can start testing today  

**Next Step:** Copy the quick integration code above to get started! 🚀
