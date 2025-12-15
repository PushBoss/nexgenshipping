# Password Reset Setup Guide

This guide explains how to ensure password reset emails are sent correctly to users.

## ✅ Implementation Status

The password reset functionality is fully implemented:

1. **Frontend**: Reset password tab in LoginDialog component
2. **Backend**: Edge Function (`auth-reset-password`) to bypass CORS
3. **Route**: `/reset-password` page for setting new password
4. **Service**: `authService.resetPassword()` with Edge Function fallback

## 🔧 Supabase Configuration

### 1. Configure Email Settings

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/erxkwytqautexizleeov)
2. Navigate to **Authentication** → **Email Templates**
3. Ensure **Reset Password** template is enabled
4. Customize the email template if needed (optional)

### 2. Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add your domains to **Redirect URLs**:
   - `http://localhost:3000/reset-password` (for local development)
   - `https://your-vercel-domain.vercel.app/reset-password` (for production)
   - `https://your-custom-domain.com/reset-password` (if using custom domain)

### 3. Configure SMTP (Optional but Recommended)

For production, configure custom SMTP:

1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Configure your email provider (Gmail, SendGrid, etc.)
4. This ensures emails are delivered reliably

**Default SMTP**: Supabase uses a default SMTP service, but emails may go to spam. Custom SMTP is recommended for production.

## 🚀 Deploy Edge Function

The password reset Edge Function needs to be deployed:

```bash
# Navigate to project root
cd /Users/aarongardiner/Desktop/nexgenshipping-main

# Deploy the password reset function
supabase functions deploy auth-reset-password

# Set environment variables (if not already set)
supabase secrets set SUPABASE_URL=https://erxkwytqautexizleeov.supabase.co
supabase secrets set SUPABASE_ANON_KEY=your_anon_key_here
```

**Note**: The Edge Function automatically uses `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Supabase's built-in environment variables, so you may not need to set them manually.

## 📧 Testing Password Reset

### 1. Request Password Reset

1. Click "Forgot your password?" on the login dialog
2. Enter your email address
3. Click "Send Reset Email"
4. You should see: "Password reset email sent! Please check your inbox."

### 2. Check Email

1. Check your inbox (and spam folder)
2. Look for email from Supabase
3. Click the reset link in the email

### 3. Set New Password

1. You'll be redirected to `/reset-password`
2. Enter your new password (minimum 6 characters)
3. Confirm your new password
4. Click "Update Password"
5. You'll be redirected to home page

## 🐛 Troubleshooting

### Email Not Received

**Possible Causes:**
1. Email in spam folder
2. Supabase SMTP not configured
3. Email address typo
4. Supabase rate limiting

**Solutions:**
1. Check spam/junk folder
2. Configure custom SMTP in Supabase
3. Verify email address spelling
4. Wait a few minutes and try again

### "Invalid or expired reset link"

**Possible Causes:**
1. Link already used
2. Link expired (default: 1 hour)
3. URL hash not properly parsed

**Solutions:**
1. Request a new password reset
2. Use the link within 1 hour
3. Ensure browser supports URL hash fragments

### CORS Error

**Solution**: The Edge Function bypasses CORS. If you still see CORS errors:
1. Ensure Edge Function is deployed
2. Check browser console for specific error
3. Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set correctly

### Edge Function Not Working

**Check:**
1. Function is deployed: `supabase functions list`
2. Logs show errors: `supabase functions logs auth-reset-password`
3. Environment variables are set: `supabase secrets list`

## 📝 Email Template Customization

You can customize the password reset email template:

1. Go to **Authentication** → **Email Templates**
2. Select **Reset Password** template
3. Customize the subject and body
4. Use variables: `{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .Token }}`

## 🔒 Security Notes

1. **Reset links expire**: Default expiration is 1 hour
2. **One-time use**: Links can only be used once
3. **Rate limiting**: Supabase limits password reset requests per email
4. **HTTPS required**: Production should use HTTPS for security

## ✅ Verification Checklist

- [ ] Edge Function deployed (`auth-reset-password`)
- [ ] Redirect URLs configured in Supabase
- [ ] Email template enabled
- [ ] SMTP configured (optional but recommended)
- [ ] Test password reset flow end-to-end
- [ ] Verify email received
- [ ] Verify password can be updated
- [ ] Verify new password works for login

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Password Reset Guide](https://supabase.com/docs/guides/auth/auth-password-reset)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)

