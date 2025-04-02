const express = require('express');
const app = express();
const port = 8080;

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.post('/auth/verify', (req, res) => {
    const { accessToken, uid } = req.body;
    if (!accessToken || !uid) {
        return res.status(400).json({ success: false, error: 'Missing credentials' });
    }
    console.log(`Verified user ${uid}`);
    res.json({ success: true, user: { uid } });
});

app.post('/auth/logout', (req, res) => {
    console.log('User logged out');
    res.json({ success: true });
});

app.post('/payment/complete', (req, res) => {
    const { paymentId, txid } = req.body;
    console.log(`Completed payment ${paymentId} with txid ${txid || 'N/A'}`);
    res.json({ success: true, paymentId, txid });
});

app.listen(port, '172.21.128.1', () => {
    console.log(`Server running at http://172.21.128.1:${port}`);
});

const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const PI_API_KEY = process.env.PI_API_KEY;  // This will get the value from your .env file
const PI_API_URL = 'https://api.minepi.com/v2';

// Approve payment
app.post('/approve-payment/:paymentId', async (req, res) => {
  try {
    await axios.post(`${PI_API_URL}/payments/${req.params.paymentId}/approve`, {}, {
      headers: { 'Authorization': `Key ${PI_API_KEY}` }
    });
    res.status(200).send('Approved');
  } catch (error) {
    console.error('Approval error:', error.response?.data || error.message);
    res.status(500).send('Approval failed');
  }
});

// Complete payment
app.post('/complete-payment/:paymentId', async (req, res) => {
  const { txid } = req.body;
  try {
    await axios.post(`${PI_API_URL}/payments/${req.params.paymentId}/complete`, { txid }, {
      headers: { 'Authorization': `Key ${PI_API_KEY}` }
    });
    res.status(200).send('Completed');
  } catch (error) {
    console.error('Completion error:', error.response?.data || error.message);
    res.status(500).send('Completion failed');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));

const express = require('express');
const app = express();
const port = 8080;

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.post('/auth/verify', (req, res) => {
    const { accessToken, uid } = req.body;
    if (!accessToken || !uid) {
        return res.status(400).json({ success: false, error: 'Missing credentials' });
    }
    console.log(`Verified user ${uid}`);
    res.json({ success: true, user: { uid } });
});

app.post('/auth/logout', (req, res) => {
    console.log('User logged out');
    res.json({ success: true });
});

app.post('/payment/approve', (req, res) => {
    const { paymentId } = req.body;
    console.log(`Approved payment ${paymentId}`);
    res.json({ success: true, paymentId });
});

app.post('/payment/complete', (req, res) => {
    const { paymentId, txid } = req.body;
    console.log(`Completed payment ${paymentId} with txid ${txid}`);
    res.json({ success: true, paymentId, txid });
});

app.listen(port, '172.21.128.1', () => {
    console.log(`Server running at http://172.21.128.1:${port}`);
});
