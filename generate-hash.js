// Simple script to generate SHA256 hash
const crypto = require('crypto');
const pin = '123456';
const hash = crypto.createHash('sha256').update(pin).digest('hex');
console.log(hash);
