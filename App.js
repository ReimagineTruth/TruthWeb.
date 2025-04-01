// App.js - Node.js/Express Backend for TruthWeb (Testnet Mode)

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for frontend requests
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (e.g., HTML, CSS)

// Simulated Pi Network API client (for Testnet)
const piNetworkClient = {
    approvePayment: async (paymentId) => {
        // In a real app, this would call the Pi Network API
        console.log(`Approving payment: ${paymentId}`);
        return { success: true };
    },
    completePayment: async (paymentId, txid) => {
        // In a real app, this would verify the transaction
        console.log(`Completing payment: ${paymentId} with txid: ${txid}`);
        return { success: true };
    }
};

// Store payments (in-memory for Testnet; use a database in production)
const payments = new Map();

// Routes
// Payment Approval Endpoint
app.post('/payment/approve', async (req, res) => {
    const { paymentId } = req.body;

    if (!paymentId) {
        return res.status(400).json({ error: 'Payment ID is required' });
    }

    try {
        const result = await piNetworkClient.approvePayment(paymentId);
        if (result.success) {
            payments.set(paymentId, { status: 'approved', timestamp: Date.now() });
            return res.status(200).json({ message: 'Payment approved', paymentId });
        } else {
            return res.status(500).json({ error: 'Payment approval failed' });
        }
    } catch (error) {
        console.error('Approval error:', error);
        return res.status(500).json({ error: 'Server error during approval' });
    }
});

// Payment Completion Endpoint
app.post('/payment/complete', async (req, res) => {
    const { paymentId, txid, debug } = req.body;

    if (!paymentId || (!txid && !debug)) {
        return res.status(400).json({ error: 'Payment ID and txid (or debug flag) are required' });
    }

    if (debug === 'cancel') {
        payments.delete(paymentId);
        return res.status(200).json({ message: 'Payment cancelled (debug mode)' });
    }

    if (!payments.has(paymentId)) {
        return res.status(404).json({ error: 'Payment not found or not approved' });
    }

    try {
        const result = await piNetworkClient.completePayment(paymentId, txid);
        if (result.success) {
            payments.set(paymentId, { status: 'completed', txid, timestamp: Date.now() });
            return res.status(200).json({ message: 'Payment completed', paymentId, txid });
        } else {
            return res.status(500).json({ error: 'Payment completion failed' });
        }
    } catch (error) {
        console.error('Completion error:', error);
        return res.status(500).json({ error: 'Server error during completion' });
    }
});

// Authentication Verification Endpoint (optional, for Pi SDK token validation)
app.post('/auth/verify', (req, res) => {
    const { accessToken } = req.body;
    if (!accessToken) {
        return res.status(400).json({ error: 'Access token is required' });
    }
    // In a real app, validate token with Pi Network API
    const isValid = true; // Simulated validation for Testnet
    if (isValid) {
        return res.status(200).json({ valid: true });
    } else {
        return res.status(401).json({ valid: false, error: 'Invalid token' });
    }
});

// Serve the main page (e.g., back.html)
app.get('/back', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'back.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`TruthWeb Testnet Server running on http://localhost:${port}`);
});
