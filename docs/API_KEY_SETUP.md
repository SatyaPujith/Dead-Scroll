# 🔑 API Key Setup Guide

## ⚠️ IMPORTANT: Never Commit Your API Key!

Your Gemini API key is personal and should never be pushed to GitHub or shared publicly.

## How to Add Your API Key

### Method 1: Using .env.local File (Recommended for Development)

1. **Copy the example file**:
```bash
cp .env.example .env.local
```

2. **Edit `.env.local`** and replace with your actual key:
```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

3. **Rebuild the extension**:
```bash
npm run build
```

4. **Reload the extension** in Chrome (chrome://extensions/ → click refresh icon)

**Note:** The `.env.local` file is already in `.gitignore` so it won't be committed.

### Method 2: Using Browser Console (Alternative)

1. **Install the extension** (see README.md)
2. **Open the extension popup** (click the extension icon)
3. **Press F12** to open Developer Tools
4. **Go to Console tab**
5. **Run this command** (replace with your actual key):

```javascript
localStorage.setItem('gemini_api_key', 'YOUR_ACTUAL_API_KEY_HERE');
```

6. **Close Developer Tools**
7. **Test the Learning Quest**

## Getting Your API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated key
5. Follow one of the methods above to add it

## Security Best Practices

✅ **DO:**
- Store API key in localStorage (browser-only)
- Use .env.local for development
- Keep .env.local in .gitignore
- Regenerate key if accidentally exposed

❌ **DON'T:**
- Hardcode API key in source code
- Commit .env.local to git
- Share your API key publicly
- Push API key to GitHub

## If You Accidentally Exposed Your Key

1. **Immediately revoke** the exposed key in [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Generate a new key**
3. **Update your local setup** with the new key
4. **Remove the key from git history** if committed:
   ```bash
   # Use git filter-branch or BFG Repo-Cleaner
   # Or create a new repository without the exposed key
   ```

## Troubleshooting

**Error: "Gemini API key not found"**
- Make sure you added the key using Method 1 above
- Check the console for the exact error message
- Verify the key is correct (no extra spaces)

**Error: "API Error: 403"**
- Your API key might be invalid or revoked
- Generate a new key and update it

**Error: "API Error: 429"**
- You've exceeded the free tier quota
- Wait for the quota to reset or upgrade your plan

## Free Tier Limits

Google Gemini API free tier includes:
- 60 requests per minute
- 1,500 requests per day
- Sufficient for personal use

Each quest uses 1 API request to generate 3 sections with quizzes.
