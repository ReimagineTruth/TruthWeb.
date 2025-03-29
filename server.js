const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const PI_API_URL = 'https://api.minepi.com';
const PI_API_KEY = process.env.PI_API_KEY || '5imutpmtbmkds0ddkp73995did0fmc7julya78qt3kokwfpnhjkpwuwnprs66hfy';
const IS_SANDBOX = true;

const authenticatedUsers = new Map();

async function verifyPiToken(accessToken) {
  try {
    const response = await axios.post(
      `${PI_API_URL}/v2/me`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-API-Key': PI_API_KEY
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Token verification failed:', error.response?.data || error.message);
    return null;
  }
}

app.post('/auth/pi', async (req, res) => {
  const { uid, username, accessToken, walletAddress } = req.body;
  if (!accessToken || !uid || !username) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  const userData = await verifyPiToken(accessToken);
  if (!userData || userData.uid !== uid) {
    return res.status(401).json({ success: false, message: 'Invalid or expired access token' });
  }
  authenticatedUsers.set(uid, { username, accessToken, walletAddress, timestamp: Date.now() });
  console.log('User authenticated:', { uid, username, walletAddress });
  res.json({ success: true, message: 'Authentication successful', user: { uid, username, walletAddress } });
});

app.post('/auth/verify', async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) {
    return res.status(400).json({ success: false, message: 'Access token required' });
  }
  const userData = await verifyPiToken(accessToken);
  if (!userData) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
  const user = authenticatedUsers.get(userData.uid);
  if (!user || user.accessToken !== accessToken) {
    return res.status(401).json({ success: false, message: 'Session not found' });
  }
  res.json({ success: true, valid: true, user: { uid: userData.uid, username: user.username } });
});

app.post('/payment/complete', async (req, res) => {
  const { paymentId, txid } = req.body;
  if (!paymentId || !txid) {
    return res.status(400).json({ success: false, message: 'Missing payment details' });
  }
  console.log('Payment completed:', { paymentId, txid });
  res.json({ success: true, paymentId, message: 'Payment completed (sandbox mode)' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (IS_SANDBOX) console.log('Running in sandbox mode');
  if (!PI_API_KEY) console.warn('Warning: PI_API_KEY is not set!');
});
