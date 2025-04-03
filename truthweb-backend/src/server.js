const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config/config');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const pageRoutes = require('./routes/pages');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public'))); // Serve static HTML files

// Routes
app.use('/auth', authRoutes);
app.use('/payment', paymentRoutes);
app.use('/', pageRoutes);

// Start server
app.listen(config.port, config.host, () => {
  console.log(`Server running at http://${config.host}:${config.port}`);
});
