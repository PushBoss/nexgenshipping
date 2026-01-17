# 🛑 Fix Signing in/Signup Issues (CORS Error)

The error logs verify that your **Vercel domain** is blocked by Supabase.

> `Access to fetch at ... from origin 'https://nexgenshipping-cyan.vercel.app' has been blocked by CORS policy`

## 🛠️ Step 1: Whitelist Your Vercel Domain
1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Navigate to **Authentication** (left sidebar) → **URL Configuration**.
3.  In the **Redirect URLs** section, add:
    *   `https://nexgenshipping-cyan.vercel.app`
    *   `https://nexgenshipping-cyan.vercel.app/`
4.  Click **Save**.

## 🛠️ Step 2: Push Changes
The error messages confusingly mentioned `localhost:3000` because that was hardcoded in an older version of your code. I have updated the code to be smarter, but that code isn't deployed yet.

Run this to deploy the fix (so future error messages are accurate):
```bash
git add .
git commit -m "fix: update CORS error message to show correct domain"
git push
```
Then wait for Vercel to redeploy.

## ✅ Summary
Once you add the URL to Supabase (Step 1), the "blocked by CORS policy" error will vanish, and signups will start working immediately—even without a redeploy.
