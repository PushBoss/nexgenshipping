# User Authentication with Supabase

## Overview
NEX-GEN Shipping now has full user authentication powered by Supabase! Users can create accounts, sign in, and their sessions persist across page refreshes.

## ✅ Features Implemented

### Account Creation (Sign Up)
- Email and password registration
- Optional first name and last name
- Email verification (Supabase sends confirmation email)
- Automatic user profile creation in database
- Password validation (minimum 6 characters)

### Sign In
- Email and password authentication
- Session persistence (stays logged in)
- Admin user detection
- Secure password handling

### Session Management
- Automatic session restore on page refresh
- Real-time auth state changes
- Secure token-based authentication
- Auto logout on session expiration

### Admin System
- Admin users stored in `user_profiles` table
- Check `is_admin` flag for admin access
- Admin Panel access restricted

## 🚀 How It Works

### For Users

#### Creating an Account
1. Click **Sign In** in the header
2. Click **Sign Up** tab
3. Fill in:
   - First Name (optional)
   - Last Name (optional)
   - Email (required)
   - Password (min 6 characters, required)
   - Confirm Password (required)
4. Click **Create Account**
5. Check your email for verification link
6. Click the verification link
7. Return to site and sign in!

#### Signing In
1. Click **Sign In** in the header
2. Enter your email and password
3. Click **Sign In**
4. ✅ You're logged in!

#### Session Persistence
- Once logged in, you stay logged in even after:
  - Closing the browser
  - Refreshing the page
  - Navigating away and coming back
- Session lasts 7 days by default (Supabase default)

### For Admins

#### Making a User an Admin
After a user creates an account, you can promote them to admin:

**Method 1: Supabase Dashboard**
1. Go to https://app.supabase.com
2. Navigate to **Table Editor** → `user_profiles`
3. Find the user by email
4. Set `is_admin` to `true`
5. Save

**Method 2: SQL Query**
```sql
UPDATE user_profiles 
SET is_admin = true 
WHERE id = 'user-uuid-here';

-- Or by email (requires joining with auth.users)
UPDATE user_profiles 
SET is_admin = true 
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'admin@example.com'
);
```

#### Admin Access
- Admins see **Admin Dashboard** in their account menu
- Admin Panel shows inventory, analytics, and product management
- Regular users cannot access admin features

## 🔧 Technical Details

### Authentication Flow

**Sign Up:**
```
User fills form
    ↓
authService.signUp()
    ↓
Supabase Auth creates user
    ↓
Email verification sent
    ↓
User profile created in database
    ↓
Success message shown
```

**Sign In:**
```
User enters credentials
    ↓
authService.signIn()
    ↓
Supabase validates password
    ↓
Session token generated
    ↓
isAdmin checked from database
    ↓
User logged in
```

**Session Restore:**
```
App loads
    ↓
Check for existing session
    ↓
Get current user from Supabase
    ↓
Check admin status
    ↓
Restore login state
```

### Database Schema

**auth.users** (Supabase managed)
- `id` - User UUID
- `email` - User email
- `encrypted_password` - Hashed password
- `email_confirmed_at` - Verification timestamp
- `created_at` - Account creation date

**user_profiles** (Your table)
- `id` - Links to auth.users.id
- `first_name` - User's first name
- `last_name` - User's last name
- `phone` - Phone number
- `avatar_url` - Profile picture
- `is_admin` - Admin flag
- `created_at` - Profile creation
- `updated_at` - Last update

### Security Features

✅ **Password Security**
- Passwords hashed with bcrypt
- Never stored in plain text
- Minimum 6 characters enforced
- Supabase handles all encryption

✅ **Session Security**
- JWT tokens for authentication
- Tokens expire after 7 days
- Secure HTTP-only cookies
- CSRF protection built-in

✅ **Email Verification**
- New users receive verification email
- Account activated on confirmation
- Prevents fake accounts
- Configurable in Supabase settings

✅ **Row Level Security (RLS)**
- Users can only access their own data
- Admins have elevated permissions
- Database enforces access rules
- No data leakage between users

## 📝 Configuration

### Enable/Disable Authentication

In `src/utils/config.ts`:
```typescript
export const config = {
  useSupabase: true,  // Set to false for demo mode
  debugMode: true,    // Shows auth logs in console
};
```

**Demo Mode** (`useSupabase: false`):
- No real accounts created
- Any email/password works
- No session persistence
- Use for testing UI only

**Production Mode** (`useSupabase: true`):
- Real Supabase authentication
- Accounts persisted in database
- Email verification required
- Secure sessions

### Email Settings

Configure in Supabase Dashboard:
1. Go to **Authentication** → **Email Templates**
2. Customize confirmation email
3. Set redirect URLs
4. Configure SMTP (optional for custom domain)

## 🎯 User Experience

### Login Dialog Features

**Tabbed Interface**
- Switch between Sign In and Sign Up
- Clean, intuitive design
- Mobile responsive

**Real-time Validation**
- Password match checking
- Email format validation
- Character length requirements
- Clear error messages

**Loading States**
- Button shows "Signing in..." during auth
- Prevents double submission
- Clear feedback to user

**Error Handling**
- Invalid credentials: "Failed to sign in"
- Password mismatch: "Passwords do not match"
- Short password: "Password must be at least 6 characters"
- Network errors handled gracefully

### Header Integration

**Before Login:**
- Shows "Sign In" link
- Lock icon on protected features
- Prompts to login for cart/wishlist

**After Login:**
- Shows user dropdown menu
- Displays "Your Orders", "Wishlist", "Account"
- Admin sees "Admin Dashboard" option
- Sign Out option available

## 🔒 Security Best Practices

### For Users
1. Use strong, unique passwords
2. Enable two-factor authentication (if available)
3. Verify your email address
4. Don't share your password
5. Sign out on shared computers

### For Admins
1. Use very strong admin passwords
2. Limit admin accounts to trusted users
3. Regularly audit admin access
4. Monitor admin activity logs
5. Keep admin list minimal

## 🐛 Troubleshooting

### "Failed to sign in"
**Cause:** Wrong email or password  
**Fix:** Check credentials, try password reset

### "Failed to create account"
**Cause:** Email already in use or invalid  
**Fix:** Use different email or sign in instead

### Email verification not received
**Cause:** Email in spam or wrong address  
**Fix:** 
1. Check spam/junk folder
2. Verify email address spelling
3. Resend verification from Supabase dashboard

### Session not persisting
**Cause:** Cookies disabled or Supabase config issue  
**Fix:**
1. Enable cookies in browser
2. Check Supabase project is active
3. Verify `useSupabase: true` in config

### Can't access Admin Panel
**Cause:** User not marked as admin  
**Fix:** Update `is_admin` flag in database (see above)

### "Supabase is disabled" error
**Cause:** `useSupabase: false` in config  
**Fix:** Set `useSupabase: true` in `src/utils/config.ts`

## 📊 Database Queries

### Check if user exists
```sql
SELECT email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'user@example.com';
```

### View all admins
```sql
SELECT u.email, p.first_name, p.last_name, p.created_at
FROM auth.users u
JOIN user_profiles p ON u.id = p.id
WHERE p.is_admin = true;
```

### Count total users
```sql
SELECT COUNT(*) as total_users 
FROM auth.users 
WHERE email_confirmed_at IS NOT NULL;
```

### Recent signups
```sql
SELECT email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;
```

## 🔄 Password Reset (Future Enhancement)

To enable password reset:
1. User clicks "Forgot Password"
2. Enters email address
3. Receives reset link via email
4. Clicks link to set new password
5. Can sign in with new password

*Note: Reset password UI can be added in future update*

## ✅ Testing Checklist

### Sign Up Flow
- [ ] Create account with all fields
- [ ] Create account with just email/password
- [ ] Verify password length validation
- [ ] Verify password match validation
- [ ] Confirm email sent
- [ ] Click verification link works
- [ ] Can sign in after verification

### Sign In Flow
- [ ] Sign in with correct credentials
- [ ] Error shown for wrong password
- [ ] Error shown for non-existent email
- [ ] Session persists after refresh
- [ ] User stays logged in after browser close
- [ ] Can sign out successfully

### Admin Flow
- [ ] Make user admin in database
- [ ] Admin sees Admin Dashboard option
- [ ] Admin can access admin panel
- [ ] Regular users cannot access admin panel
- [ ] Admin status persists across sessions

## 📚 API Reference

### authService Methods

```typescript
// Sign up new user
await authService.signUp(email, password, {
  firstName: 'John',
  lastName: 'Doe'
});

// Sign in
await authService.signIn(email, password);

// Sign out
await authService.signOut();

// Get current user
const user = await authService.getCurrentUser();

// Check if admin
const isAdmin = await authService.isAdmin();

// Update profile
await authService.updateProfile({
  firstName: 'Jane',
  lastName: 'Smith',
  phone: '555-1234'
});

// Listen to auth changes
const subscription = authService.onAuthStateChange((user) => {
  console.log('User changed:', user);
});
```

## 🚀 Next Steps

1. **Deploy schema** (if not done): See `QUICK_START.md`
2. **Create your admin account**: Sign up, then promote to admin
3. **Test the flow**: Create account → Verify email → Sign in
4. **Configure email templates**: Customize in Supabase dashboard
5. **Add more users**: Invite team members to create accounts

## 🎉 Status

- ✅ Sign up implemented
- ✅ Sign in implemented
- ✅ Session persistence
- ✅ Admin system
- ✅ Email verification
- ✅ Password validation
- ✅ Profile creation
- ✅ Secure authentication
- ✅ Error handling
- ✅ Loading states

---

**Your authentication system is ready!** Users can now create accounts and sign in securely.
