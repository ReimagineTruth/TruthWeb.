require('dotenv').config();  // This loads environment variables from .env file
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const PI_API_KEY = process.env.PI_API_KEY;  // This will get the value from your .env file
const PI_API_URL = 'https://api.minepi.com/v2';
const PORT = process.env.PORT || 8080;  // Use PORT from .env, default to 8080 if not set

// Enable CORS
app.use(cors());

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route for root - serving your index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle payment completion
app.post('/payment/complete', async (req, res) => {
    const { paymentId, txid, debug } = req.body;
    console.log('Payment completed:', paymentId, txid, debug);

    try {
        await axios.post(`${PI_API_URL}/payments/${paymentId}/complete`, { txid }, {
            headers: { 'Authorization': `Key ${PI_API_KEY}` }
        });
        res.status(200).send('Payment completed successfully');
    } catch (error) {
        console.error('Error completing payment:', error.response?.data || error.message);
        res.status(500).send('Payment completion failed');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
