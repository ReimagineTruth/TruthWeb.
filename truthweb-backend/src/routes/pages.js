const express = require('express');
const path = require('path');

const router = express.Router();

// Serve all HTML pages
const pages = [
  'index', 'home', 'marketplace', 'profile', 'wallet', 'cart', 'vendor', 'about', 'support',
  'truthwebfeed', 'stream', 'messagingchat', 'community', 'pioneerverification',
  'pi-powered-marketplace', 'multi-category-listings', 'global-expansion', 'escrow-system',
  'user-profiles-wallet', 'pitrack', 'pitrade', 'api-docs', 'referral-program',
  'kycverification', 'fraud-detection', 'developers', 'truwebbot', 'future',
  'contact', 'faq', 'safety-guidelines', 'terms', 'privacy', 'deals', 'auth', 'donate', 'payment-plans'
];

pages.forEach(page => {
  router.get(`/${page}.html`, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', `${page}.html`));
  });
});

// Redirect root to index.html
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

module.exports = router;
