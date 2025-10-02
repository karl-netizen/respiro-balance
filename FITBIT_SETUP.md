# Fitbit API Integration Setup Guide

This app supports both **Bluetooth** (real-time) and **Fitbit API** (cloud-based) heart rate monitoring.

## Fitbit API Setup Requirements

### 1. Register Your App on Fitbit

1. Go to [dev.fitbit.com](https://dev.fitbit.com)
2. Sign in with your Fitbit account
3. Click "Register an App"
4. Fill in the application details:
   - **Application Name**: Respiro Balance (or your app name)
   - **Description**: Heart rate monitoring for meditation
   - **Application Website**: Your app URL
   - **Organization**: Your name/organization
   - **Organization Website**: Your website
   - **OAuth 2.0 Application Type**: Select **"Personal"** or **"Browser"**
   - **Callback URL**: `https://yourdomain.com/fitbit-callback` (use your actual domain)
   - **Default Access Type**: Select **"Read Only"**

5. Agree to terms and click "Register"

### 2. Get Your Client ID

After registration, you'll receive:
- **OAuth 2.0 Client ID** - You need this!
- Client Secret (not needed for implicit grant flow)

### 3. Configure Your App

You have two options:

#### Option A: Environment Variable (Recommended)
Create a `.env` file in your project root:
```env
VITE_FITBIT_CLIENT_ID=your_client_id_here
```

#### Option B: Hardcode (Development Only)
Edit `src/services/fitbit/FitbitAPIConnector.ts`:
```typescript
this.clientId = 'YOUR_ACTUAL_CLIENT_ID';
```

### 4. Request Intraday API Access

**Important**: By default, Fitbit only provides heart rate data at daily granularity. To get real-time (1-second intervals) data, you need to request special access:

1. Go to [dev.fitbit.com/build/reference/web-api/intraday/](https://dev.fitbit.com/build/reference/web-api/intraday/)
2. Fill out the "Intraday API Request Form"
3. Explain your use case (e.g., "Real-time heart rate monitoring for meditation app")
4. Wait for approval (usually 1-2 business days)

**Without Intraday Access**: You'll only get daily summaries, not live heart rate data.

### 5. Update Callback URL

Make sure your callback URL matches in:
1. Fitbit Developer Portal settings
2. Your app configuration (`redirectUri` in FitbitAPIConnector)

For local development, Fitbit doesn't support `localhost`, so you'll need to:
- Use a tool like ngrok to create a public URL
- Or deploy to a staging environment

## Usage

### Bluetooth Connection (No Setup Required)
- Works with any BLE heart rate monitor
- Real-time updates
- No API keys needed
- Requires Chrome/Edge/Opera browser

### Fitbit API Connection (Requires Setup)
- Works with all Fitbit devices
- 15-second polling interval
- Requires Fitbit account and app registration
- Works in any browser

## How Users Connect

### Bluetooth Flow:
1. User clicks "Connect Bluetooth Device"
2. Browser shows device picker
3. User selects their device
4. Real-time heart rate starts streaming

### Fitbit API Flow:
1. User clicks "Connect Fitbit Account"
2. Redirected to Fitbit login page
3. User authorizes the app
4. Redirected back to app
5. Heart rate data syncs every 15 seconds

## Troubleshooting

### "Fitbit Client ID not configured"
- Make sure you've set `VITE_FITBIT_CLIENT_ID` environment variable
- Rebuild your app after adding the variable

### "Authentication failed"
- Check that callback URL matches in Fitbit portal
- Ensure you're using HTTPS (not HTTP)
- Clear browser cache and try again

### "No heart rate data"
- Ensure your Fitbit device is synced
- Check that you have Intraday API access approved
- Verify the device has recent activity data

### Callback URL Issues
- For production: Use your actual domain
- For development: Use ngrok or similar tunneling service
- Always use HTTPS (Fitbit requires it)

## API Rate Limits

Fitbit API has rate limits:
- **150 requests per hour** per user
- Our app polls every 15 seconds = **240 requests/hour** if running continuously

To stay within limits, the app automatically:
- Stops polling when tab is inactive
- Only polls when biofeedback page is open
- Shows clear connection status

## Security Notes

- Access tokens are stored in `localStorage`
- Tokens expire after 1 year
- Users can revoke access anytime at fitbit.com
- Client Secret is NOT needed (using implicit grant flow)
- Never commit your Client ID to public repositories

## Support

For Fitbit API issues, contact:
- Fitbit Developer Support: [dev.fitbit.com/support](https://dev.fitbit.com/support)
- API Documentation: [dev.fitbit.com/build/reference](https://dev.fitbit.com/build/reference)

For app-specific issues, check the browser console for error messages.
