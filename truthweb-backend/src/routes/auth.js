const express = require('express');
const axios = require('axios');
const config = require('../config/config');

const router = express.Router();

router.post('/verify', async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ error: 'Access token required' });
  }

  try {
    // Verify token with Pi Network (Testnet)
    const response = await axios.post(
      'https://api.minepi.com/v2/me',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const userData = response.data;
    res.json({
      success: true,
      user: {
        username: userData.username,
        uid: userData.uid,
      },
    });
  } catch (error) {
    console.error('Auth verification failed:', error);
    res.status(401).json({ error: 'Authentication failed', details: error.message });
  }
});

module.exports = router;
