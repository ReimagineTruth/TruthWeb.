// index.js - Main Entry Point for TruthWeb Testnet Server

// Import the Express app from App.js
const app = require('./App');

// Define the port
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`TruthWeb Testnet Server running on http://localhost:${port}`);
    console.log('Serving static files from /public and handling Pi payment endpoints.');
});
