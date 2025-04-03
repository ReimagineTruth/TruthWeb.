const express = require('express');
const axios = require('axios');
const config = require('../config/config');

const router = express.Router();

// Approve payment
router.post('/approve', async (req, res) => {
  const { paymentId, amount, memo } = req.body;

  if (!paymentId || !amount || !memo) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Simulate approval (in Testnet, no real Pi is transferred)
    console.log(`Approving payment ${paymentId} for ${amount} Pi: ${memo}`);
    res.json({ success: true, paymentId });
  } catch (error) {
    console.error('Payment approval failed:', error);
    res.status(500).json({ error: 'Approval failed', details: error.message });
  }
});

// Complete payment
router.post('/complete', async (req, res) => {
  const { paymentId, txid, memo } = req.body;

  if (!paymentId || !txid) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Simulate completion (Testnet mode)
    console.log(`Completing payment ${paymentId} with txid ${txid}: ${memo}`);
    res.json({ success: true, paymentId, txid });
  } catch (error) {
    console.error('Payment completion failed:', error);
    res.status(500).json({ error: 'Completion failed', details: error.message });
  }
});

module.exports = router;
