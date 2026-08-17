# NextPay Sales Hub — Authentication & Security Setup

## Overview

The Sales Hub now includes:
1. **Google Sign-In Authentication** - Only @nextpaypos.com emails can access
2. **Admin Dashboard** - Manage authorized users and system settings
3. **Feedback Form** - Agents can quickly suggest changes

---

## Setup Instructions

### 1. Google OAuth 2.0 Configuration

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (Name: "NextPay Sales Hub")
3. Enable Google+ API

#### Step 2: Create OAuth 2.0 Credentials
1. Go to "Credentials" in the left menu
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Add these Authorized redirect URIs:
   - `https://hub.nextpaypos.com/login.html`
   - `http://localhost:8000/hub/login.html` (for local testing)
5. Copy the **Client ID** (you'll need this)

#### Step 3: Update login.html
In `/hub/login.html`, find this line:
```html
data-client_id="YOUR_GOOGLE_CLIENT_ID"
```

Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID from Google Cloud Console.

---

### 2. Feedback Form Configuration (Optional but Recommended)

#### Option A: Using Formspree (Easiest)
1. Go to [Formspree.io](https://formspree.io/)
2. Sign up and create a new form
3. The form will send emails to your email address
4. Copy the form endpoint (e.g., `https://formspree.io/f/abc123xyz`)

#### Option B: Using Your Own Backend
Create an endpoint that accepts POST requests with this structure:
```json
{
  "email": "agent@nextpaypos.com",
  "feedback": "User's feedback text",
  "page": "/hub/dashboard.html",
  "timestamp": "2026-08-16T12:00:00Z"
}
```

#### Step 1: Update Feedback Endpoint
In `/hub/js/hub.js`, find the `showFeedbackModal()` function and update:
```javascript
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
```

Replace `YOUR_FORM_ID` with your actual Formspree form ID or your custom endpoint.

---

### 3. Managing Admin Users

Authorized admins can access the admin dashboard at `/hub/admin.html`.

#### Current Admins
- dom@nextpaypos.com (Owner)
- alexander@nextpaypos.com (Admin)

#### To Add More Admins
1. Open `/hub/js/hub.js`
2. Find the `ADMINS` array (around line 53):
```javascript
const ADMINS = ['dom@nextpaypos.com', 'alexander@nextpaypos.com'];
```
3. Add more email addresses:
```javascript
const ADMINS = ['dom@nextpaypos.com', 'alexander@nextpaypos.com', 'newadmin@nextpaypos.com'];
```
4. Deploy the change (git push)

---

## How It Works

### For Agents
1. Navigate to any hub page
2. If not authenticated, redirected to `/login.html`
3. Click "Sign in with Google"
4. Sign in with @nextpaypos.com email
5. Automatically redirected to dashboard
6. Use "Sign out" button in sidebar to log out

### For Admins
1. Sign in normally as an agent
2. Access admin features in the sidebar
3. Admins can view:
   - All agent deals overview
   - System status
   - Recently suggested changes
4. Go to `/hub/admin.html` for admin dashboard

### Feedback Flow
1. Agent clicks "💭 Suggest a change" in sidebar
2. Modal opens with feedback form
3. Agent types suggestion
4. Clicks "Send Feedback"
5. Email sent to configured address (Formspree or custom backend)
6. Dom receives feedback at dom@nextpaypos.com

---

## Security Notes

### Authentication Storage
- Authentication data stored in `localStorage` as `hub_auth`
- Token valid for 1 hour
- Automatically expires after 1 hour
- Cleared on logout

### Domain Restriction
- Only @nextpaypos.com email addresses can access
- Enforced on every page load
- Non-matching domains redirected to login

### Admin Access
- Admin email list hardcoded in code (edit js/hub.js)
- Admin-only pages check email before showing content
- Admin navigation items only show to admins

---

## Testing Locally

### Mock Authentication (Without Google OAuth)
For testing without setting up Google OAuth:

In browser console, run:
```javascript
localStorage.setItem('hub_auth', JSON.stringify({
  email: 'test@nextpaypos.com',
  name: 'Test User',
  timestamp: Date.now(),
  token: 'mock'
}));
location.href = '/hub/dashboard.html';
```

### Test Admin Access
Same as above, but use `dom@nextpaypos.com` as email.

---

## Troubleshooting

### "Access denied" error on login
- Check that Google Client ID is correct in login.html
- Verify email ends with @nextpaypos.com
- Clear browser cache and localStorage
- Try incognito/private browsing

### Feedback form not sending
- Check Formspree form ID is correct in hub.js
- Verify Formspree endpoint is correct
- Check browser console for errors
- Test by running this in console:
```javascript
fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: 'test' })
}).then(r => console.log('Status:', r.status));
```

### Admin dashboard not showing
- Confirm email is in ADMINS array in js/hub.js
- Check localStorage has correct email
- Reload page after making changes to ADMINS array
- Visit /hub/admin.html directly

---

## Files Modified/Created

- ✅ `/hub/login.html` - New Google Sign-In page
- ✅ `/hub/js/hub.js` - Added authentication, logout, feedback modal
- ✅ `/hub/admin.html` - Already exists (can be enhanced)
- ✅ `/hub/SETUP_AUTHENTICATION.md` - This file

---

## Next Steps

1. [ ] Set up Google OAuth 2.0 credentials
2. [ ] Update Client ID in login.html
3. [ ] Set up Formspree account (or custom backend)
4. [ ] Update feedback endpoint in hub.js
5. [ ] Deploy changes via git push
6. [ ] Test authentication with a test email
7. [ ] Add any additional admins to ADMINS array
8. [ ] Announce new login requirement to team

---

## Support

For issues or questions about authentication setup:
- Contact dom@nextpaypos.com
- Check browser console for error messages
- Review this setup guide

Last updated: August 16, 2026
