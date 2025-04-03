require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8080,
  host: process.env.HOST || '172.21.128.1',
  piApiKey: process.env.PI_API_KEY || 'your-pi-api-key', // Replace with your Pi Testnet API key
  piAppId: 'fukqtl4kyz2ijkjilcx1bfhfnx4f8qcvmllaqajrncetgyvo4z8qotuqcnyorx9x', // From your HTML
  isTestnet: true, // Testnet mode
};
