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
