const express = require('express');
const cors = require('cors');
const FB = require('fb');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Facebook API configuration
FB.options({
  appId: process.env.FACEBOOK_APP_ID,
  appSecret: process.env.FACEBOOK_APP_SECRET,
  version: 'v18.0' // Using the latest stable version as of now
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running properly' });
});

// Generate Facebook login URL
app.get('/api/login-url', (req, res) => {
  const redirectUri = `${req.protocol}://${req.get('host')}/api/callback`;
  const loginUrl = FB.getLoginUrl({
    scope: 'user_friends,public_profile',
    redirect_uri: redirectUri,
    state: 'facebook_auth'
  });
  
  res.json({ loginUrl });
});

// Facebook callback endpoint
app.get('/api/callback', async (req, res) => {
  const code = req.query.code;
  
  if (!code) {
    return res.redirect('/?error=authentication_failed');
  }
  
  try {
    const redirectUri = `${req.protocol}://${req.get('host')}/api/callback`;
    const response = await FB.api('oauth/access_token', {
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      redirect_uri: redirectUri,
      code
    });
    
    // Store the access token in session or pass to client securely
    // For simplicity, we'll redirect with token in query param (NOT SECURE for production)
    res.redirect(`/?token=${response.access_token}`);
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.redirect('/?error=token_exchange_failed');
  }
});

// Get friends list
app.get('/api/friends', async (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(401).json({ error: 'No access token provided' });
  }
  
  try {
    FB.setAccessToken(token);
    const result = await FB.api('/me/friends');
    res.json(result);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

// Delete a friend (unfriend)
app.delete('/api/friends/:friendId', async (req, res) => {
  const { token } = req.query;
  const { friendId } = req.params;
  
  if (!token) {
    return res.status(401).json({ error: 'No access token provided' });
  }
  
  try {
    FB.setAccessToken(token);
    // Facebook doesn't have a direct API for unfriending, 
    // we have to use a DELETE request to /me/friends/{user-id}
    const result = await FB.api(`/me/friends/${friendId}`, 'DELETE');
    res.json(result);
  } catch (error) {
    console.error('Error deleting friend:', error);
    res.status(500).json({ error: 'Failed to delete friend' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the app`);
}); 