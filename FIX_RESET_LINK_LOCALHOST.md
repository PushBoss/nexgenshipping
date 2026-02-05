# 🔗 Fix Password Reset Link Pointing to Localhost

If your password reset emails contain links starting with `http://localhost:3000` instead of `https://www.nexgenshipping.net`, it is because **Supabase** is still configured with the default development settings.

Supabase uses the **Site URL** setting to generate these links when the requested redirect URL is not allowlisted.

## 🛠️ How to Fix (Supabase Dashboard)

1.  Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Select your project (`erxkwytq...`).
3.  Go to **Authentication** (left sidebar) → **URL Configuration**.

### Step 1: Update Site URL
*   **Site URL:** Change `http://localhost:3000` to `https://www.nexgenshipping.net`
    *   *This ensures that default links always go to your live site.*

### Step 2: Add Redirect URLs
*   **Redirect URLs:** Add the following URLs to the list:
    *   `https://www.nexgenshipping.net/`
    *   `https://www.nexgenshipping.net/reset-password`
    *   `https://www.nexgenshipping.net/auth/callback` (optional but recommended)

### Step 3: Save
*   Click **Save**.

---

## 🧪 Detailed Explanation
When your app requests a password reset, it sends:
`redirectTo: "https://www.nexgenshipping.net/reset-password"`

Supabase checks if this URL is in your **Redirect URLs** list.
*   **If YES:** The email link points to `https://www.nexgenshipping.net/reset-password`.
*   **If NO:** Supabase ignores your request and falls back to the **Site URL**, which is currently set to `localhost`.

## ⚡ Quick Test
After saving the changes:
1.  Go to your live site: `https://www.nexgenshipping.net`
2.  Click **Sign In** → **Forgot Password**.
3.  Request a new link.
4.  The new email should now point to the correct domain.
